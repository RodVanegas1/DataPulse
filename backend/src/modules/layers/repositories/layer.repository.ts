import { prisma } from '../../../shared/database/prisma';

export class LayerRepository {
  listLayers(enabled?: boolean) {
    return prisma.layer.findMany({
      where: enabled === undefined ? undefined : { enabled },
      orderBy: { name: 'asc' },
    });
  }

  getLayer(slug: string) {
    return prisma.layer.findUnique({ where: { slug } });
  }
}
