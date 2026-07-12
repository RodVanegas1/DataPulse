import { Buffer } from 'node:buffer';
import { RequestHandler } from 'express';
import { sendSuccess } from '../../../core/responses/api-response';
import { BinaryReport, ReportService } from '../services/report.service';

const isBinaryReport = (report: unknown): report is BinaryReport =>
  typeof report === 'object' && report !== null && Buffer.isBuffer((report as BinaryReport).body);

export class ReportController {
  constructor(private readonly service = new ReportService()) {}

  tourismPlaces: RequestHandler = async (req, res, next) => {
    try {
      const report = await this.service.tourismPlacesReport(req.query as { format: string; departmentSlug?: string; categorySlug?: string });
      if (isBinaryReport(report)) {
        res.setHeader('Content-Type', report.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
        return res.status(200).send(report.body);
      }
      return sendSuccess(res, 'Tourism places report generated', report);
    } catch (error) {
      return next(error);
    }
  };
}
