import { Prisma } from '@prisma/client';
import { prisma } from '../../../shared/database/prisma';
import { getPagination } from '../../../core/utils/pagination';
import { SearchFilters } from '../services/search.service';

export class SearchRepository {
  async search(filters: SearchFilters) {
    const query = filters.query;
    const pagination = getPagination(filters.page, filters.limit);
    const placeWhere: Prisma.TouristPlaceWhereInput = {
      status: 'PUBLISHED',
      OR: [{ name: { contains: query } }, { description: { contains: query } }, { address: { contains: query } }],
    };

    const [places, departments, municipalities, categories, events, tags] = await prisma.$transaction([
      prisma.touristPlace.findMany({
        where: placeWhere,
        ...pagination,
        orderBy: { [filters.sortBy ?? 'name']: filters.sortOrder ?? 'asc' },
        include: { category: true, department: true, municipality: true },
      }),
      prisma.department.findMany({ where: { name: { contains: query } }, ...pagination, orderBy: { name: 'asc' } }),
      prisma.municipality.findMany({ where: { name: { contains: query } }, ...pagination, orderBy: { name: 'asc' }, include: { department: true } }),
      prisma.category.findMany({ where: { name: { contains: query } }, ...pagination, orderBy: { name: 'asc' } }),
      prisma.event.findMany({ where: { title: { contains: query } }, ...pagination, orderBy: { startsAt: 'asc' } }),
      prisma.tag.findMany({ where: { name: { contains: query } }, ...pagination, orderBy: { name: 'asc' } }),
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

    return { places: placesWithDistance, departments, municipalities, categories, events, tags };
  }

  async autocomplete(query: string, limit: number) {
    const [places, municipalities, categories] = await prisma.$transaction([
      prisma.touristPlace.findMany({ where: { name: { contains: query } }, take: limit, select: { name: true, slug: true } }),
      prisma.municipality.findMany({ where: { name: { contains: query } }, take: limit, select: { name: true, slug: true } }),
      prisma.category.findMany({ where: { name: { contains: query } }, take: limit, select: { name: true, slug: true } }),
    ]);

    return [...places, ...municipalities, ...categories].slice(0, limit);
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
