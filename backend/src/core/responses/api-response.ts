import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta: Record<string, unknown>;
  pagination: PaginationMeta | null;
}

export function sendSuccess<T>(
  res: Response,
  message: string,
  data: T,
  options: { statusCode?: number; meta?: Record<string, unknown>; pagination?: PaginationMeta | null } = {},
) {
  const payload: ApiEnvelope<T> = {
    success: true,
    message,
    data,
    meta: options.meta ?? {},
    pagination: options.pagination ?? null,
  };

  return res.status(options.statusCode ?? 200).json(payload);
}
