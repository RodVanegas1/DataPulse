import { z } from 'zod';

export const reportQuerySchema = z.object({
  format: z.enum(['json', 'csv', 'excel', 'pdf', 'geojson']).default('json'),
  departmentSlug: z.string().optional(),
  categorySlug: z.string().optional(),
});
