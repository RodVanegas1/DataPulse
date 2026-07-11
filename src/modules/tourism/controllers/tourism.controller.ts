import { RequestHandler } from 'express';
import { sendSuccess } from '../../../core/responses/api-response';
import { TourismService } from '../services/tourism.service';
import { PlaceListFilters } from '../repositories/tourism.repository';

export class TourismController {
  constructor(private readonly service = new TourismService()) {}

  listPlaces: RequestHandler = async (req, res, next) => {
    try {
      const result = await this.service.listPlaces(req.query as unknown as PlaceListFilters);
      return sendSuccess(res, 'Tourist places retrieved', result.items, {
        pagination: result.pagination,
      });
    } catch (error) {
      return next(error);
    }
  };

  getPlace: RequestHandler = async (req, res, next) => {
    try {
      const place = await this.service.getPlace(req.params.slug);
      return sendSuccess(res, 'Tourist place retrieved', place);
    } catch (error) {
      return next(error);
    }
  };

  createPlace: RequestHandler = async (req, res, next) => {
    try {
      const place = await this.service.createPlace(req.body);
      return sendSuccess(res, 'Tourist place created', place, { statusCode: 201 });
    } catch (error) {
      return next(error);
    }
  };

  updatePlace: RequestHandler = async (req, res, next) => {
    try {
      const place = await this.service.updatePlace(req.params.id, req.body);
      return sendSuccess(res, 'Tourist place updated', place);
    } catch (error) {
      return next(error);
    }
  };

  deletePlace: RequestHandler = async (req, res, next) => {
    try {
      await this.service.deletePlace(req.params.id);
      return sendSuccess(res, 'Tourist place deleted', { id: req.params.id });
    } catch (error) {
      return next(error);
    }
  };

  categories: RequestHandler = async (_req, res, next) => {
    try {
      const categories = await this.service.listCategories();
      return sendSuccess(res, 'Categories retrieved', categories);
    } catch (error) {
      return next(error);
    }
  };
}
