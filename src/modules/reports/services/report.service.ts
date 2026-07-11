import { prisma } from '../../../shared/database/prisma';

export class ReportService {
  async tourismPlacesReport(filters: { format: string; departmentSlug?: string; categorySlug?: string }) {
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
      generatedAt: new Date().toISOString(),
      format: filters.format,
      filters,
      recordCount: places.length,
    };

    const statistics = {
      verified: places.filter((place) => place.verified).length,
      featured: places.filter((place) => place.featured).length,
    };

    if (filters.format === 'geojson') {
      return {
        metadata,
        statistics,
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

    return {
      metadata,
      statistics,
      summary: `Tourism places report with ${places.length} records.`,
      dataset: places,
      exportHint: filters.format === 'json' ? null : `${filters.format.toUpperCase()} renderer can consume this normalized payload.`,
    };
  }
}
