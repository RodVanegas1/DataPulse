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
}
