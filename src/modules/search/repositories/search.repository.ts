import { prisma } from '../../../shared/database/prisma';

export class SearchRepository {
  async search(query: string) {
    const [places, departments, municipalities, categories, events, tags] = await prisma.$transaction([
      prisma.touristPlace.findMany({
        where: { OR: [{ name: { contains: query } }, { description: { contains: query } }] },
        take: 20,
        include: { category: true, department: true, municipality: true },
      }),
      prisma.department.findMany({ where: { name: { contains: query } }, take: 20 }),
      prisma.municipality.findMany({ where: { name: { contains: query } }, take: 20, include: { department: true } }),
      prisma.category.findMany({ where: { name: { contains: query } }, take: 20 }),
      prisma.event.findMany({ where: { title: { contains: query } }, take: 20 }),
      prisma.tag.findMany({ where: { name: { contains: query } }, take: 20 }),
    ]);

    return { places, departments, municipalities, categories, events, tags };
  }

  async autocomplete(query: string, limit: number) {
    const [places, municipalities, categories] = await prisma.$transaction([
      prisma.touristPlace.findMany({ where: { name: { contains: query } }, take: limit, select: { name: true, slug: true } }),
      prisma.municipality.findMany({ where: { name: { contains: query } }, take: limit, select: { name: true, slug: true } }),
      prisma.category.findMany({ where: { name: { contains: query } }, take: limit, select: { name: true, slug: true } }),
    ]);

    return [...places, ...municipalities, ...categories].slice(0, limit);
  }
}
