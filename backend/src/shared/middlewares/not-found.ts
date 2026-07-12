import { RequestHandler } from 'express';

export const notFoundHandler: RequestHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    data: null,
    meta: {},
    pagination: null,
  });
};
