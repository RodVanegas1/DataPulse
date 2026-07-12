import { z } from 'zod';
import { paginationQuerySchema } from '../../../core/utils/pagination';

export const placeQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional(),
  categorySlug: z.string().optional(),
  departmentSlug: z.string().optional(),
  municipalitySlug: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  verified: z.coerce.boolean().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});

export const createPlaceSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  history: z.string().optional(),
  categoryId: z.string(),
  departmentId: z.string(),
  municipalityId: z.string(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  address: z.string().optional(),
  openingHours: z.unknown().optional(),
  price: z.string().optional(),
  website: z.string().url().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  socialMedia: z.unknown().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  services: z.unknown().optional(),
  gallery: z.unknown().optional(),
  accessibility: z.unknown().optional(),
  parking: z.boolean().optional(),
  wifi: z.boolean().optional(),
  petFriendly: z.boolean().optional(),
  verified: z.boolean().optional(),
  featured: z.boolean().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});

export const updatePlaceSchema = createPlaceSchema.partial();
