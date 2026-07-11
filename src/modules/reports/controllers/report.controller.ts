import { RequestHandler } from 'express';
import { sendSuccess } from '../../../core/responses/api-response';
import { ReportService } from '../services/report.service';

export class ReportController {
  constructor(private readonly service = new ReportService()) {}

  tourismPlaces: RequestHandler = async (req, res, next) => {
    try {
      const report = await this.service.tourismPlacesReport(req.query as { format: string; departmentSlug?: string; categorySlug?: string });
      return sendSuccess(res, 'Tourism places report generated', report);
    } catch (error) {
      return next(error);
    }
  };
}
