import { Buffer } from 'node:buffer';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../shared/database/prisma';

type TourismPlaceReportFilters = { format: string; departmentSlug?: string; categorySlug?: string };
type ReportPlace = Prisma.TouristPlaceGetPayload<{ include: { category: true; department: true; municipality: true } }>;

export interface BinaryReport {
  body: Buffer;
  contentType: string;
  filename: string;
}

export class ReportService {
  async tourismPlacesReport(filters: TourismPlaceReportFilters) {
    const places = await prisma.touristPlace.findMany({
      where: {
        status: 'PUBLISHED',
        department: filters.departmentSlug ? { slug: filters.departmentSlug } : undefined,
        category: filters.categorySlug ? { slug: filters.categorySlug } : undefined,
      },
      include: { category: true, department: true, municipality: true },
      orderBy: { name: 'asc' },
    });

    const metadata = {
      title: 'Tourism Places Report',
      generatedAt: new Date().toISOString(),
      format: filters.format,
      filters,
      recordCount: places.length,
      locale: 'es-SV',
      timezone: 'America/El_Salvador',
    };

    const statistics = {
      verified: places.filter((place) => place.verified).length,
      featured: places.filter((place) => place.featured).length,
      averageRating: this.averageRating(places),
    };

    const rows = places.map((place) => ({
      id: place.id,
      name: place.name,
      slug: place.slug,
      category: place.category.name,
      department: place.department.name,
      municipality: place.municipality.name,
      latitude: Number(place.latitude),
      longitude: Number(place.longitude),
      rating: place.rating ? Number(place.rating) : null,
      verified: place.verified,
      featured: place.featured,
      address: place.address,
    }));

    if (filters.format === 'geojson') {
      return {
        metadata,
        statistics,
        executiveSummary: this.executiveSummary(places),
        dataset: {
          type: 'FeatureCollection',
          features: places.map((place) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [Number(place.longitude), Number(place.latitude)],
            },
            properties: {
              id: place.id,
              name: place.name,
              category: place.category.name,
              department: place.department.name,
              municipality: place.municipality.name,
            },
          })),
        },
      };
    }

    if (filters.format === 'csv') {
      return this.renderCsv(rows, metadata.title);
    }

    if (filters.format === 'excel') {
      return this.renderExcel(rows, metadata, statistics);
    }

    if (filters.format === 'pdf') {
      return this.renderPdf(rows, metadata, statistics, this.executiveSummary(places));
    }

    return {
      metadata,
      statistics,
      executiveSummary: this.executiveSummary(places),
      dataset: rows,
    };
  }

  private averageRating(places: ReportPlace[]) {
    const ratings = places.map((place) => (place.rating ? Number(place.rating) : null)).filter((rating): rating is number => rating !== null);
    if (!ratings.length) return null;
    return Number((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(2));
  }

  private executiveSummary(places: ReportPlace[]) {
    const departments = new Set(places.map((place) => place.department.name));
    const categories = new Set(places.map((place) => place.category.name));
    return `Generated ${places.length} published tourism records across ${departments.size} departments and ${categories.size} categories.`;
  }

  private renderCsv(rows: Array<Record<string, unknown>>, title: string): BinaryReport {
    const headers = Object.keys(rows[0] ?? { id: '', name: '', category: '', department: '', municipality: '' });
    const csv = [
      title,
      `Generated At,${new Date().toISOString()}`,
      '',
      headers.join(','),
      ...rows.map((row) => headers.map((header) => this.csvValue(row[header])).join(',')),
    ].join('\n');

    return {
      body: Buffer.from(csv, 'utf8'),
      contentType: 'text/csv; charset=utf-8',
      filename: 'tourism-places-report.csv',
    };
  }

  private async renderExcel(rows: Array<Record<string, unknown>>, metadata: Record<string, unknown>, statistics: Record<string, unknown>): Promise<BinaryReport> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Territorial Intelligence Platform';
    workbook.created = new Date();

    const summary = workbook.addWorksheet('Summary');
    summary.addRows([
      ['Title', metadata.title],
      ['Generated At', metadata.generatedAt],
      ['Record Count', metadata.recordCount],
      ['Verified Places', statistics.verified],
      ['Featured Places', statistics.featured],
      ['Average Rating', statistics.averageRating ?? 'N/A'],
    ]);
    summary.columns = [{ width: 24 }, { width: 48 }];

    const data = workbook.addWorksheet('Places');
    data.columns = Object.keys(rows[0] ?? { id: '', name: '' }).map((key) => ({ header: key, key, width: 22 }));
    data.addRows(rows);
    data.getRow(1).font = { bold: true };

    const arrayBuffer = await workbook.xlsx.writeBuffer();
    return {
      body: Buffer.from(arrayBuffer),
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      filename: 'tourism-places-report.xlsx',
    };
  }

  private renderPdf(
    rows: Array<Record<string, unknown>>,
    metadata: Record<string, unknown>,
    statistics: Record<string, unknown>,
    executiveSummary: string,
  ): Promise<BinaryReport> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 48, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () =>
        resolve({
          body: Buffer.concat(chunks),
          contentType: 'application/pdf',
          filename: 'tourism-places-report.pdf',
        }),
      );

      doc.fontSize(18).text(String(metadata.title), { underline: true });
      doc.moveDown();
      doc.fontSize(10).text(`Generated At: ${metadata.generatedAt}`);
      doc.text(`Record Count: ${metadata.recordCount}`);
      doc.text(`Verified: ${statistics.verified}`);
      doc.text(`Featured: ${statistics.featured}`);
      doc.text(`Average Rating: ${statistics.averageRating ?? 'N/A'}`);
      doc.moveDown();
      doc.fontSize(12).text('Executive Summary');
      doc.fontSize(10).text(executiveSummary);
      doc.moveDown();
      doc.fontSize(12).text('Places');
      rows.slice(0, 40).forEach((row) => {
        doc.fontSize(9).text(`${row.name} | ${row.department} | ${row.municipality} | ${row.category}`);
      });
      if (rows.length > 40) {
        doc.moveDown().text(`Additional rows omitted from PDF preview: ${rows.length - 40}`);
      }
      doc.end();
    });
  }

  private csvValue(value: unknown) {
    if (value === null || value === undefined) return '';
    const text = String(value).replace(/"/g, '""');
    return /[",\n]/.test(text) ? `"${text}"` : text;
  }
}
