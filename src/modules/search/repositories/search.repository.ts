import { Prisma } from '@prisma/client';
import { prisma } from '../../../shared/database/prisma';
import { getPagination } from '../../../core/utils/pagination';
import { SearchFilters } from '../services/search.service';

export class SearchRepository {
  async search(filters: SearchFilters) {
    const query = filters.query;
    const pagination = getPagination(filters.page, filters.limit);
    const textFilter = { contains: query, mode: 'insensitive' as const };
    const placeWhere: Prisma.TouristPlaceWhereInput = {
      status: 'PUBLISHED',
      category: filters.categorySlug ? { slug: filters.categorySlug } : undefined,
      department: filters.departmentSlug ? { slug: filters.departmentSlug } : undefined,
      municipality: filters.municipalitySlug ? { slug: filters.municipalitySlug } : undefined,
      tags: filters.tags?.length ? { some: { tag: { slug: { in: filters.tags } } } } : undefined,
      OR: [{ name: textFilter }, { description: textFilter }, { address: textFilter }],
    };
    const eventWhere: Prisma.EventWhereInput = {
      title: textFilter,
      touristPlace: {
        department: filters.departmentSlug ? { slug: filters.departmentSlug } : undefined,
        municipality: filters.municipalitySlug ? { slug: filters.municipalitySlug } : undefined,
        category: filters.categorySlug ? { slug: filters.categorySlug } : undefined,
      },
    };
    const sortBy = this.placeSortField(filters.sortBy);

    const [places, departments, municipalities, categories, events, tags] = await prisma.$transaction([
      prisma.touristPlace.findMany({
        where: placeWhere,
        ...pagination,
        orderBy: { [sortBy]: filters.sortOrder ?? 'asc' },
        include: { category: true, department: true, municipality: true, tags: { include: { tag: true } } },
      }),
      prisma.department.findMany({ where: { name: textFilter }, ...pagination, orderBy: { name: 'asc' } }),
      prisma.municipality.findMany({
        where: { name: textFilter, department: filters.departmentSlug ? { slug: filters.departmentSlug } : undefined },
        ...pagination,
        orderBy: { name: 'asc' },
        include: { department: true },
      }),
      prisma.category.findMany({ where: { name: textFilter }, ...pagination, orderBy: { name: 'asc' } }),
      prisma.event.findMany({ where: eventWhere, ...pagination, orderBy: { startsAt: 'asc' }, include: { touristPlace: true } }),
      prisma.tag.findMany({ where: { name: textFilter }, ...pagination, orderBy: { name: 'asc' } }),
    ]);

    const placesWithDistance =
      filters.latitude !== undefined && filters.longitude !== undefined
        ? places
            .map((place) => ({
              ...place,
              distanceKm: this.distanceKm(filters.latitude as number, filters.longitude as number, Number(place.latitude), Number(place.longitude)),
            }))
            .filter((place) => (filters.radiusKm ? place.distanceKm <= filters.radiusKm : true))
            .sort((a, b) => a.distanceKm - b.distanceKm)
        : places;

    return {
      places: placesWithDistance.map((place) => ({ ...place, rank: this.rankPlace(place, query, filters) })),
      departments,
      municipalities,
      categories,
      events,
      tags,
      facets: {
        placeCount: placesWithDistance.length,
        departmentCount: departments.length,
        municipalityCount: municipalities.length,
        categoryCount: categories.length,
        eventCount: events.length,
        tagCount: tags.length,
      },
    };
  }

  async autocomplete(query: string, limit: number) {
    const textFilter = { contains: query, mode: 'insensitive' as const };
    const [places, municipalities, categories] = await prisma.$transaction([
      prisma.touristPlace.findMany({ where: { name: textFilter, status: 'PUBLISHED' }, take: limit, select: { name: true, slug: true } }),
      prisma.municipality.findMany({ where: { name: textFilter }, take: limit, select: { name: true, slug: true } }),
      prisma.category.findMany({ where: { name: textFilter }, take: limit, select: { name: true, slug: true } }),
    ]);

    return [
      ...places.map((item) => ({ ...item, type: 'place' })),
      ...municipalities.map((item) => ({ ...item, type: 'municipality' })),
      ...categories.map((item) => ({ ...item, type: 'category' })),
    ].slice(0, limit);
  }

  private placeSortField(sortBy?: string) {
    return ['name', 'rating', 'createdAt', 'updatedAt'].includes(sortBy ?? '') ? (sortBy as 'name' | 'rating' | 'createdAt' | 'updatedAt') : 'name';
  }

  private rankPlace(place: { name: string; featured: boolean; verified: boolean; rating: Prisma.Decimal | null }, query: string, filters: SearchFilters) {
    const normalizedName = place.name.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    return (
      (normalizedName === normalizedQuery ? 100 : 0) +
      (normalizedName.includes(normalizedQuery) ? 30 : 0) +
      (place.featured ? 15 : 0) +
      (place.verified ? 10 : 0) +
      (place.rating ? Number(place.rating) : 0) +
      (filters.latitude !== undefined && filters.longitude !== undefined ? 5 : 0)
    );
  }

  private distanceKm(originLat: number, originLng: number, targetLat: number, targetLng: number) {
    const earthRadiusKm = 6371;
    const toRadians = (value: number) => (value * Math.PI) / 180;
    const deltaLat = toRadians(targetLat - originLat);
    const deltaLng = toRadians(targetLng - originLng);
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(toRadians(originLat)) * Math.cos(toRadians(targetLat)) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    return Number((earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2));
  }
}
