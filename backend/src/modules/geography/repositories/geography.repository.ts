import { prisma } from '../../../shared/database/prisma';

export class GeographyRepository {
  listDepartments() {
    return prisma.department.findMany({
      orderBy: { name: 'asc' },
      include: { municipalities: { orderBy: { name: 'asc' } } },
    });
  }

  listMunicipalities(departmentSlug?: string) {
    return prisma.municipality.findMany({
      where: departmentSlug ? { department: { slug: departmentSlug } } : undefined,
      orderBy: { name: 'asc' },
      include: { department: true },
    });
  }
}
