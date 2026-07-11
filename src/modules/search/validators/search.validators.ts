import { z } from 'zod';
import { paginationQuerySchema } from '../../../core/utils/pagination';

export const searchQuerySchema = paginationQuerySchema.extend({
  q: z.string().min(1),
  type: z.enum(['all', 'places', 'departments', 'municipalities', 'categories', 'events', 'tags']).default('all'),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  radiusKm: z.coerce.number().positive().optional(),
});

export const autocompleteQuerySchema = z.object({
  q: z.string().min(1),
  limit: z.coerce.number().int().positive().max(20).default(10),
});
