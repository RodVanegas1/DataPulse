import { Buffer } from 'node:buffer';
import { RequestHandler } from 'express';
import { sendSuccess } from '../../../core/responses/api-response';
import { DEFAULT_REPORT_FORMATS } from '../../../core/constants/platform';
import { BinaryReport, ReportService } from '../../reports/services/report.service';

const isBinaryReport = (report: unknown): report is BinaryReport =>
  typeof report === 'object' && report !== null && Buffer.isBuffer((report as BinaryReport).body);

export class ExportController {
  constructor(private readonly reportService = new ReportService()) {}

  formats: RequestHandler = (_req, res) => {
    return sendSuccess(res, 'Export formats retrieved', {
      formats: DEFAULT_REPORT_FORMATS,
      downloadable: ['csv', 'excel', 'pdf'],
      apiFormats: ['json', 'geojson'],
    });
  };

  tourismPlaces: RequestHandler = async (req, res, next) => {
    try {
      const report = await this.reportService.tourismPlacesReport(req.query as { format: string; departmentSlug?: string; categorySlug?: string });
      if (isBinaryReport(report)) {
        res.setHeader('Content-Type', report.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
        return res.status(200).send(report.body);
      }
      return sendSuccess(res, 'Tourism places export generated', report);
    } catch (error) {
      return next(error);
    }
  };
}
