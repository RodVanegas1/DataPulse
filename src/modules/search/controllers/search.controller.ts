import { RequestHandler } from 'express';
import { sendSuccess } from '../../../core/responses/api-response';
import { SearchService } from '../services/search.service';

export class SearchController {
  constructor(private readonly service = new SearchService()) {}

  search: RequestHandler = async (req, res, next) => {
    try {
      const results = await this.service.search({
        query: req.query.q as string,
        type: req.query.type as string,
        page: Number(req.query.page),
        limit: Number(req.query.limit),
        departmentSlug: req.query.departmentSlug as string | undefined,
        municipalitySlug: req.query.municipalitySlug as string | undefined,
        categorySlug: req.query.categorySlug as string | undefined,
        tags: req.query.tags ? String(req.query.tags).split(',').map((tag) => tag.trim()).filter(Boolean) : undefined,
        latitude: req.query.latitude ? Number(req.query.latitude) : undefined,
        longitude: req.query.longitude ? Number(req.query.longitude) : undefined,
        radiusKm: req.query.radiusKm ? Number(req.query.radiusKm) : undefined,
        sortBy: req.query.sortBy as string | undefined,
        sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined,
      });
      return sendSuccess(res, 'Search completed', results, {
        meta: {
          query: req.query.q,
          filters: {
            departmentSlug: req.query.departmentSlug ?? null,
            municipalitySlug: req.query.municipalitySlug ?? null,
            categorySlug: req.query.categorySlug ?? null,
            tags: req.query.tags ?? null,
          },
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
