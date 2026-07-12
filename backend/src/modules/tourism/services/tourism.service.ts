import { Prisma } from '@prisma/client';
import { NotFoundError } from '../../../core/errors/api-error';
import { buildPagination } from '../../../core/utils/pagination';
import { TourismRepository, PlaceListFilters } from '../repositories/tourism.repository';

const slug = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export class TourismService {
  constructor(private readonly repository = new TourismRepository()) {}

  async listPlaces(filters: PlaceListFilters) {
    const { items, total } = await this.repository.listPlaces(filters);
    return {
      items,
      pagination: buildPagination(filters.page, filters.limit, total),
    };
  }

  async getPlace(slugValue: string) {
    const place = await this.repository.getPlaceBySlug(slugValue);
    if (!place) {
      throw new NotFoundError('Tourist place');
    }
    return place;
  }

  createPlace(data: Record<string, unknown>) {
    const createData = {
      ...data,
      slug: slug(data.name as string),
      category: { connect: { id: data.categoryId as string } },
      department: { connect: { id: data.departmentId as string } },
      municipality: { connect: { id: data.municipalityId as string } },
    } as Prisma.TouristPlaceCreateInput;

    delete (createData as Record<string, unknown>).categoryId;
    delete (createData as Record<string, unknown>).departmentId;
    delete (createData as Record<string, unknown>).municipalityId;

    return this.repository.createPlace(createData);
  }

  async updatePlace(id: string, data: Record<string, unknown>) {
    const updateData = {
      ...data,
      ...(data.name ? { slug: slug(data.name as string) } : {}),
    } as Prisma.TouristPlaceUpdateInput;

    delete (updateData as Record<string, unknown>).categoryId;
    delete (updateData as Record<string, unknown>).departmentId;
    delete (updateData as Record<string, unknown>).municipalityId;

    if (data.categoryId) updateData.category = { connect: { id: data.categoryId as string } };
    if (data.departmentId) updateData.department = { connect: { id: data.departmentId as string } };
    if (data.municipalityId) updateData.municipality = { connect: { id: data.municipalityId as string } };

    return this.repository.updatePlace(id, updateData);
  }

  deletePlace(id: string) {
    return this.repository.deletePlace(id);
  }

  listCategories() {
    return this.repository.listCategories();
  }
}
