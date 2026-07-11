import { RequestHandler } from 'express';
import { sendSuccess } from '../../../core/responses/api-response';
import { GeographyService } from '../services/geography.service';

export class GeographyController {
  constructor(private readonly service = new GeographyService()) {}

  departments: RequestHandler = async (_req, res, next) => {
    try {
      const departments = await this.service.getDepartments();
      return sendSuccess(res, 'Departments retrieved', departments);
    } catch (error) {
      return next(error);
    }
  };

  municipalities: RequestHandler = async (req, res, next) => {
    try {
      const municipalities = await this.service.getMunicipalities(req.query.departmentSlug as string | undefined);
      return sendSuccess(res, 'Municipalities retrieved', municipalities);
    } catch (error) {
      return next(error);
    }
  };
}
