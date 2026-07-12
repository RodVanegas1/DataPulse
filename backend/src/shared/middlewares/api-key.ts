import { RequestHandler } from 'express';
import { config } from '../../config/env';
import { ApiError } from '../../core/errors/api-error';

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export const optionalApiKeyMiddleware: RequestHandler = (req, _res, next) => {
  if (!WRITE_METHODS.has(req.method) || !config.API_KEY) {
    return next();
  }

  const providedKey = req.header('x-api-key') ?? req.query.apiKey;
  if (providedKey === config.API_KEY) {
    return next();
  }

  return next(new ApiError(401, 'A valid API key is required for write operations'));
};
