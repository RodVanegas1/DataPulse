import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const slug = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

async function main() {
  const departments = ['San Salvador', 'La Libertad', 'Santa Ana'];

  for (const name of departments) {
    await prisma.department.upsert({
      where: { slug: slug(name) },
      update: {},
      create: {
        name,
        slug: slug(name),
        description: `Departamento de ${name}.`,
      },
    });
  }

  const sanSalvador = await prisma.department.findUniqueOrThrow({ where: { slug: 'san-salvador' } });
  const laLibertad = await prisma.department.findUniqueOrThrow({ where: { slug: 'la-libertad' } });
  const santaAna = await prisma.department.findUniqueOrThrow({ where: { slug: 'santa-ana' } });

  const municipalities = [
    { name: 'San Salvador Centro', departmentId: sanSalvador.id },
    { name: 'Tamanique', departmentId: laLibertad.id },
    { name: 'Santa Ana Centro', departmentId: santaAna.id },
  ];

  for (const municipality of municipalities) {
    await prisma.municipality.upsert({
      where: { slug: slug(municipality.name) },
      update: {},
      create: {
        ...municipality,
        slug: slug(municipality.name),
      },
    });
  }

  const categories = [
    { name: 'Nature', icon: 'leaf', color: '#2f855a' },
    { name: 'Culture', icon: 'landmark', color: '#805ad5' },
    { name: 'Beach', icon: 'waves', color: '#0ea5e9' },
    { name: 'Volcano', icon: 'mountain', color: '#dc2626' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: slug(category.name) },
      update: {},
      create: {
        ...category,
        slug: slug(category.name),
      },
    });
  }

  const beach = await prisma.category.findUniqueOrThrow({ where: { slug: 'beach' } });
  const volcano = await prisma.category.findUniqueOrThrow({ where: { slug: 'volcano' } });
  const tamanique = await prisma.municipality.findUniqueOrThrow({ where: { slug: 'tamanique' } });
  const santaAnaCentro = await prisma.municipality.findUniqueOrThrow({ where: { slug: 'santa-ana-centro' } });

  await prisma.touristPlace.upsert({
    where: { slug: 'playa-el-tunco' },
    update: {},
    create: {
      name: 'Playa El Tunco',
      slug: 'playa-el-tunco',
      description: 'Destino costero reconocido por surf, vida nocturna y emprendimientos turísticos.',
      categoryId: beach.id,
      departmentId: laLibertad.id,
      municipalityId: tamanique.id,
      latitude: 13.4949,
      longitude: -89.3813,
      address: 'Tamanique, La Libertad',
      rating: 4.7,
      services: ['surf', 'restaurants', 'lodging'],
      gallery: [],
      accessibility: { wheelchair: false },
      parking: true,
      wifi: true,
      petFriendly: true,
      verified: true,
      featured: true,
    },
  });

  await prisma.touristPlace.upsert({
    where: { slug: 'volcan-santa-ana' },
    update: {},
    create: {
      name: 'Volcan Santa Ana',
      slug: 'volcan-santa-ana',
      description: 'Volcan activo y uno de los paisajes naturales mas visitados de El Salvador.',
      categoryId: volcano.id,
      departmentId: santaAna.id,
      municipalityId: santaAnaCentro.id,
      latitude: 13.8533,
      longitude: -89.6308,
      address: 'Parque Nacional Los Volcanes',
      rating: 4.8,
      services: ['hiking', 'guides', 'viewpoint'],
      gallery: [],
      accessibility: { wheelchair: false },
      parking: true,
      verified: true,
      featured: true,
    },
  });

  const layers = ['Tourism', 'Hotels', 'Restaurants', 'Culture', 'Nature', 'Transport', 'Security', 'Economy', 'Climate', 'Events', 'Mobility', 'Population', 'Investment'];

  for (const name of layers) {
    await prisma.layer.upsert({
      where: { slug: slug(name) },
      update: {},
      create: {
        name,
        slug: slug(name),
        type: 'geojson',
        description: `${name} territorial layer.`,
        config: { clusterable: true, mapbox: true, leaflet: true },
        style: { visible: true },
      },
    });
  }

  for (const language of [
    { code: 'es', name: 'Spanish' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'pt', name: 'Portuguese' },
  ]) {
    await prisma.language.upsert({
      where: { code: language.code },
      update: {},
      create: language,
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
