import { RequestHandler } from 'express';
import { sendSuccess } from '../../../core/responses/api-response';
import { SearchService } from '../services/search.service';

export class SearchController {
  constructor(private readonly service = new SearchService()) {}

  search: RequestHandler = async (req, res, next) => {
    try {
      const results = await this.service.search(req.query.q as string, req.query.type as string);
      return sendSuccess(res, 'Search completed', results, {
        meta: {
          query: req.query.q,
          nearby: req.query.latitude && req.query.longitude ? { latitude: req.query.latitude, longitude: req.query.longitude, radiusKm: req.query.radiusKm } : null,
        },
      });
    } catch (error) {
      return next(error);
    }
  };

  autocomplete: RequestHandler = async (req, res, next) => {
    try {
      const results = await this.service.autocomplete(req.query.q as string, Number(req.query.limit));
      return sendSuccess(res, 'Autocomplete completed', results);
    } catch (error) {
      return next(error);
    }
  };
}
