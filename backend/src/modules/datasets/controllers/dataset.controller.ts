import { RequestHandler } from 'express';
import { sendSuccess } from '../../../core/responses/api-response';
import { DatasetService } from '../services/dataset.service';

export class DatasetController {
  constructor(private readonly service = new DatasetService()) {}

  list: RequestHandler = async (_req, res, next) => {
    try {
      return sendSuccess(res, 'Datasets retrieved', await this.service.list());
    } catch (error) {
      return next(error);
    }
  };

  capabilities: RequestHandler = (_req, res) => {
    return sendSuccess(res, 'Dataset import capabilities retrieved', this.service.getImportCapabilities());
  };

  export: RequestHandler = async (req, res, next) => {
    try {
      const format = (req.query.format ?? 'json') as 'json' | 'geojson' | 'csv';
      const exported = await this.service.export(req.params.slug, format);
      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${req.params.slug}.csv"`);
        return res.status(200).send(exported);
      }
      return sendSuccess(res, 'Dataset exported', exported);
    } catch (error) {
      return next(error);
    }
  };

  validateImport: RequestHandler = (req, res, next) => {
    try {
      return sendSuccess(res, 'Dataset import payload validated', this.service.validateImport(req.body));
    } catch (error) {
      return next(error);
    }
  };
}
