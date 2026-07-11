import { prisma } from '../../../shared/database/prisma';

export class AnalyticsRepository {
  async dashboardSummary() {
    const [places, departments, municipalities, categories, layers, events, featured] = await prisma.$transaction([
      prisma.touristPlace.count(),
      prisma.department.count(),
      prisma.municipality.count(),
      prisma.category.count(),
      prisma.layer.count({ where: { enabled: true } }),
      prisma.event.count(),
      prisma.touristPlace.count({ where: { featured: true } }),
    ]);

    return { places, departments, municipalities, categories, layers, events, featured };
  }

  placesByDepartment() {
    return prisma.department.findMany({
      select: { id: true, name: true, slug: true, _count: { select: { places: true } } },
      orderBy: { name: 'asc' },
    });
  }

  placesByCategory() {
    return prisma.category.findMany({
      select: { id: true, name: true, slug: true, _count: { select: { places: true } } },
      orderBy: { name: 'asc' },
    });
  }

  topRatedPlaces() {
    return prisma.touristPlace.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [{ rating: 'desc' }, { name: 'asc' }],
      take: 10,
      include: { category: true, department: true, municipality: true },
    });
  }

  featuredPlaces() {
    return prisma.touristPlace.findMany({
      where: { featured: true, status: 'PUBLISHED' },
      take: 10,
      include: { category: true, department: true, municipality: true },
    });
  }

  upcomingEvents() {
    return prisma.event.findMany({
      where: { startsAt: { gte: new Date() }, status: 'SCHEDULED' },
      orderBy: { startsAt: 'asc' },
      take: 10,
    });
  }
}
