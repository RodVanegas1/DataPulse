import { RequestHandler } from 'express';
import { ZodSchema } from 'zod';

export function validateQuery(schema: ZodSchema): RequestHandler {
  return (req, _res, next) => {
    req.query = schema.parse(req.query) as typeof req.query;
    next();
  };
}

export function validateBody(schema: ZodSchema): RequestHandler {
  return (req, _res, next) => {
    req.body = schema.parse(req.body);
    next();
  };
}
