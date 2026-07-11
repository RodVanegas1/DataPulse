import { prisma } from '../../../shared/database/prisma';

export class DatasetRepository {
  list() {
    return prisma.dataset.findMany({ where: { public: true }, orderBy: { name: 'asc' } });
  }

  getBySlug(slug: string) {
    return prisma.dataset.findUnique({ where: { slug }, include: { reports: true } });
  }
}
