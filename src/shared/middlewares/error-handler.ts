import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../../core/errors/api-error';
import { logger } from '../logger/logger';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      data: null,
      meta: { errors: error.flatten() },
      pagination: null,
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      data: null,
      meta: error.details ? { details: error.details } : {},
      pagination: null,
    });
  }

  logger.error('Unhandled application error', { error });

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    data: null,
    meta: {},
    pagination: null,
  });
};
