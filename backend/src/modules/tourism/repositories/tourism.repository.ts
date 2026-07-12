import { Prisma } from '@prisma/client';
import { prisma } from '../../../shared/database/prisma';
import { getPagination } from '../../../core/utils/pagination';

export interface PlaceListFilters {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder: 'asc' | 'desc';
  search?: string;
  categorySlug?: string;
  departmentSlug?: string;
  municipalitySlug?: string;
  featured?: boolean;
  verified?: boolean;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

const placeInclude = {
  category: true,
  department: true,
  municipality: true,
  tags: { include: { tag: true } },
  languages: { include: { language: true } },
} satisfies Prisma.TouristPlaceInclude;

export class TourismRepository {
  async listPlaces(filters: PlaceListFilters) {
    const where: Prisma.TouristPlaceWhereInput = {
      status: filters.status ?? 'PUBLISHED',
      featured: filters.featured,
      verified: filters.verified,
      category: filters.categorySlug ? { slug: filters.categorySlug } : undefined,
      department: filters.departmentSlug ? { slug: filters.departmentSlug } : undefined,
      municipality: filters.municipalitySlug ? { slug: filters.municipalitySlug } : undefined,
      OR: filters.search
        ? [
            { name: { contains: filters.search } },
            { description: { contains: filters.search } },
            { address: { contains: filters.search } },
          ]
        : undefined,
    };

    const [items, total] = await prisma.$transaction([
      prisma.touristPlace.findMany({
        where,
        ...getPagination(filters.page, filters.limit),
        orderBy: { [filters.sortBy ?? 'name']: filters.sortOrder },
        include: placeInclude,
      }),
      prisma.touristPlace.count({ where }),
    ]);

    return { items, total };
  }

  getPlaceBySlug(slug: string) {
    return prisma.touristPlace.findUnique({ where: { slug }, include: placeInclude });
  }

  createPlace(data: Prisma.TouristPlaceCreateInput) {
    return prisma.touristPlace.create({ data, include: placeInclude });
  }

  updatePlace(id: string, data: Prisma.TouristPlaceUpdateInput) {
    return prisma.touristPlace.update({ where: { id }, data, include: placeInclude });
  }

  deletePlace(id: string) {
    return prisma.touristPlace.delete({ where: { id } });
  }

  listCategories() {
    return prisma.category.findMany({ orderBy: { name: 'asc' }, include: { children: true } });
  }
}
