import { prisma } from '../../../shared/database/prisma';

export class DatasetRepository {
  list() {
    return prisma.dataset.findMany({ where: { public: true }, orderBy: { name: 'asc' } });
  }
}
