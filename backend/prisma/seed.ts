import { PrismaClient, PlaceStatus, EventStatus, DatasetFormat, ExportFormat } from '@prisma/client';

const prisma = new PrismaClient();

const slug = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function seededRandom(seedStr: string) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function rangeFrom(rng: () => number, min: number, max: number) {
  return min + rng() * (max - min);
}

const DEPARTMENTS = [
  { code: 'AH', name: 'Ahuachapán', lat: 13.9214, lng: -89.845 },
  { code: 'SA', name: 'Santa Ana', lat: 13.9942, lng: -89.559 },
  { code: 'SO', name: 'Sonsonate', lat: 13.7196, lng: -89.7241 },
  { code: 'CH', name: 'Chalatenango', lat: 14.0333, lng: -88.9333 },
  { code: 'LL', name: 'La Libertad', lat: 13.6769, lng: -89.2797 },
  { code: 'SS', name: 'San Salvador', lat: 13.6929, lng: -89.2182 },
  { code: 'CU', name: 'Cuscatlán', lat: 13.7167, lng: -88.9333 },
  { code: 'LP', name: 'La Paz', lat: 13.5, lng: -88.9167 },
  { code: 'CA', name: 'Cabañas', lat: 13.8667, lng: -88.7833 },
  { code: 'SV', name: 'San Vicente', lat: 13.6411, lng: -88.7889 },
  { code: 'US', name: 'Usulután', lat: 13.35, lng: -88.45 },
  { code: 'SM', name: 'San Miguel', lat: 13.4833, lng: -88.1833 },
  { code: 'MO', name: 'Morazán', lat: 13.7667, lng: -88.1167 },
  { code: 'UN', name: 'La Unión', lat: 13.3369, lng: -87.8433 },
];

const MUNICIPALITIES: { name: string; dept: string; lat: number; lng: number }[] = [
  { name: 'Ahuachapán Norte', dept: 'AH', lat: 13.9784, lng: -89.7508 },
  { name: 'Ahuachapán Centro', dept: 'AH', lat: 13.9214, lng: -89.845 },
  { name: 'Ahuachapán Sur', dept: 'AH', lat: 13.7822, lng: -89.9214 },
  { name: 'Santa Ana Norte', dept: 'SA', lat: 14.0644, lng: -89.5589 },
  { name: 'Santa Ana Centro', dept: 'SA', lat: 13.9942, lng: -89.559 },
  { name: 'Santa Ana Este', dept: 'SA', lat: 13.95, lng: -89.45 },
  { name: 'Santa Ana Oeste', dept: 'SA', lat: 13.9333, lng: -89.6667 },
  { name: 'Sonsonate Norte', dept: 'SO', lat: 13.85, lng: -89.7 },
  { name: 'Sonsonate Centro', dept: 'SO', lat: 13.7196, lng: -89.7241 },
  { name: 'Sonsonate Este', dept: 'SO', lat: 13.7, lng: -89.5833 },
  { name: 'Sonsonate Oeste', dept: 'SO', lat: 13.5928, lng: -89.8319 },
  { name: 'Chalatenango Norte', dept: 'CH', lat: 14.3167, lng: -89.1333 },
  { name: 'Chalatenango Centro', dept: 'CH', lat: 14.0333, lng: -88.9333 },
  { name: 'Chalatenango Sur', dept: 'CH', lat: 13.95, lng: -89.0333 },
  { name: 'La Libertad Norte', dept: 'LL', lat: 13.8, lng: -89.35 },
  { name: 'La Libertad Centro', dept: 'LL', lat: 13.6769, lng: -89.2797 },
  { name: 'La Libertad Este', dept: 'LL', lat: 13.6667, lng: -89.15 },
  { name: 'La Libertad Oeste', dept: 'LL', lat: 13.75, lng: -89.45 },
  { name: 'La Libertad Costa', dept: 'LL', lat: 13.4864, lng: -89.3225 },
  { name: 'La Libertad Sur', dept: 'LL', lat: 13.55, lng: -89.25 },
  { name: 'San Salvador Norte', dept: 'SS', lat: 13.7833, lng: -89.2 },
  { name: 'San Salvador Este', dept: 'SS', lat: 13.7, lng: -89.1333 },
  { name: 'San Salvador Centro', dept: 'SS', lat: 13.6929, lng: -89.2182 },
  { name: 'San Salvador Oeste', dept: 'SS', lat: 13.6833, lng: -89.3 },
  { name: 'San Salvador Sur', dept: 'SS', lat: 13.6167, lng: -89.2 },
  { name: 'Cuscatlán Norte', dept: 'CU', lat: 13.8333, lng: -88.95 },
  { name: 'Cuscatlán Sur', dept: 'CU', lat: 13.65, lng: -88.9 },
  { name: 'La Paz Oeste', dept: 'LP', lat: 13.5333, lng: -89.1667 },
  { name: 'La Paz Centro', dept: 'LP', lat: 13.5, lng: -88.9167 },
  { name: 'La Paz Este', dept: 'LP', lat: 13.4667, lng: -88.75 },
  { name: 'Cabañas Oeste', dept: 'CA', lat: 13.9333, lng: -88.95 },
  { name: 'Cabañas Este', dept: 'CA', lat: 13.8667, lng: -88.7833 },
  { name: 'San Vicente Norte', dept: 'SV', lat: 13.75, lng: -88.85 },
  { name: 'San Vicente Sur', dept: 'SV', lat: 13.6411, lng: -88.7889 },
  { name: 'Usulután Norte', dept: 'US', lat: 13.45, lng: -88.5 },
  { name: 'Usulután Este', dept: 'US', lat: 13.3, lng: -88.2833 },
  { name: 'Usulután Oeste', dept: 'US', lat: 13.35, lng: -88.45 },
  { name: 'San Miguel Norte', dept: 'SM', lat: 13.7, lng: -88.15 },
  { name: 'San Miguel Centro', dept: 'SM', lat: 13.4833, lng: -88.1833 },
  { name: 'San Miguel Oeste', dept: 'SM', lat: 13.45, lng: -88.35 },
  { name: 'Morazán Norte', dept: 'MO', lat: 13.85, lng: -88.1 },
  { name: 'Morazán Sur', dept: 'MO', lat: 13.7667, lng: -88.1167 },
  { name: 'La Unión Norte', dept: 'UN', lat: 13.6, lng: -87.85 },
  { name: 'La Unión Sur', dept: 'UN', lat: 13.3369, lng: -87.8433 },
];

const CATEGORIES = [
  { name: 'Playas', icon: 'waves', color: '#0ea5e9' },
  { name: 'Volcanes', icon: 'mountain', color: '#dc2626' },
  { name: 'Lagos y Lagunas', icon: 'droplet', color: '#0891b2' },
  { name: 'Ríos y Cascadas', icon: 'waterfall', color: '#06b6d4' },
  { name: 'Parques Nacionales', icon: 'trees', color: '#15803d' },
  { name: 'Reservas Naturales', icon: 'leaf', color: '#166534' },
  { name: 'Sitios Arqueológicos', icon: 'landmark', color: '#92400e' },
  { name: 'Museos', icon: 'building-2', color: '#7c3aed' },
  { name: 'Centros Históricos', icon: 'castle', color: '#b45309' },
  { name: 'Iglesias y Templos', icon: 'church', color: '#a16207' },
  { name: 'Mercados', icon: 'shopping-basket', color: '#ea580c' },
  { name: 'Hoteles', icon: 'bed', color: '#0d9488' },
  { name: 'Restaurantes', icon: 'utensils', color: '#f59e0b' },
  { name: 'Parques Urbanos', icon: 'tree-pine', color: '#16a34a' },
  { name: 'Malecones', icon: 'anchor', color: '#0369a1' },
  { name: 'Puertos', icon: 'ship', color: '#075985' },
  { name: 'Aeropuertos', icon: 'plane', color: '#334155' },
  { name: 'Terminales de Transporte', icon: 'bus', color: '#475569' },
  { name: 'Centros Comerciales', icon: 'shopping-cart', color: '#9333ea' },
  { name: 'Centros Culturales', icon: 'theater', color: '#6d28d9' },
  { name: 'Miradores', icon: 'binoculars', color: '#059669' },
  { name: 'Pueblos Turísticos', icon: 'home', color: '#c026d3' },
  { name: 'Rutas Turísticas', icon: 'route', color: '#d97706' },
  { name: 'Balnearios y Aguas Termales', icon: 'hot-tub', color: '#0891b2' },
  { name: 'Zonas Arqueológicas Mayas', icon: 'pyramid', color: '#78350f' },
  { name: 'Ferias y Artesanías', icon: 'palette', color: '#db2777' },
];

const TAGS = [
  'surf', 'senderismo', 'aventura', 'familia', 'fotografia', 'historia', 'religioso', 'artesanias',
  'cafe', 'gastronomia', 'naturaleza', 'vida-nocturna', 'romantico', 'accesible', 'camping', 'aves',
  'buceo', 'kayak', 'pesca', 'atardecer', 'patrimonio', 'colonial', 'maya', 'guerra-civil',
  'ecoturismo', 'agroturismo', 'cultura-viva', 'mural', 'artesania-textil', 'ceramica', 'indigo',
  'cafe-de-altura', 'volcanico', 'aguas-termales', 'mirador', 'cascada', 'rio', 'lago', 'playa-surf',
  'playa-familiar', 'centro-historico', 'arquitectura', 'museo', 'feria-patronal', 'semana-santa',
  'navidad', 'gastronomia-tipica', 'pupusas', 'mariscos', 'artesania-madera', 'hamacas', 'turicentro',
  'parque-nacional', 'reserva-de-biosfera', 'manglar', 'humedal', 'senderos-interpretativos', 'grutas',
  'petroglifos', 'sitio-unesco-tentativo', 'compras', 'vida-nocturna-urbana', 'transporte', 'accesibilidad',
  'pet-friendly', 'wifi-gratis', 'estacionamiento', 'mirador-panoramico', 'aventura-extrema', 'tirolesa',
  'ciclismo', 'motociclismo',
];

const LANGUAGES = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
];

const LAYERS = [
  'Turismo', 'Hoteles', 'Restaurantes', 'Cultura y Patrimonio', 'Naturaleza y Areas Protegidas',
  'Transporte y Terminales', 'Seguridad', 'Economia', 'Clima', 'Eventos', 'Movilidad', 'Poblacion',
  'Inversion', 'Playas', 'Volcanes', 'Rios y Cuerpos de Agua', 'Sitios Arqueologicos', 'Mercados',
  'Rutas Turisticas', 'Aeropuertos y Puertos', 'Educacion', 'Salud',
];

interface PlaceSeed {
  name: string;
  dept: string;
  muni: string;
  category: string;
  tags: string[];
  lat: number;
  lng: number;
  address: string;
  description: string;
  history?: string;
  price?: string;
  services: string[];
  rating: number;
  featured?: boolean;
  verified?: boolean;
  parking?: boolean;
  wifi?: boolean;
  petFriendly?: boolean;
}

const PLACES: PlaceSeed[] = [
  // --- PLAYAS ---
  { name: 'Playa El Tunco', dept: 'LL', muni: 'La Libertad Costa', category: 'Playas', tags: ['surf', 'vida-nocturna', 'playa-surf', 'fotografia'], lat: 13.4906, lng: -89.3814, address: 'Cantón El Tunco, Tamanique, La Libertad', description: 'Playa de arena volcánica reconocida internacionalmente por sus olas de clase mundial para surf, con una zona hotelera y gastronómica consolidada alrededor de la formación rocosa que le da nombre.', history: 'Se popularizó entre surfistas internacionales desde los años 90 y hoy es uno de los íconos de Surf City El Salvador.', price: 'Gratis (acceso público de playa)', services: ['surf', 'restaurantes', 'hospedaje', 'clases de surf'], rating: 4.6, featured: true, verified: true, parking: true, wifi: true, petFriendly: true },
  { name: 'Playa El Zonte', dept: 'LL', muni: 'La Libertad Costa', category: 'Playas', tags: ['surf', 'playa-surf', 'romantico'], lat: 13.4917, lng: -89.4433, address: 'Cantón El Zonte, Chiltiupán, La Libertad', description: 'Conocida como "Bitcoin Beach", combina playa de surf con una comunidad costera que fue pionera en adopción de pagos digitales en El Salvador.', services: ['surf', 'restaurantes', 'hospedaje'], rating: 4.5, featured: true, verified: true, parking: true },
  { name: 'Playa El Sunzal', dept: 'LL', muni: 'La Libertad Costa', category: 'Playas', tags: ['surf', 'playa-surf', 'atardecer'], lat: 13.4913, lng: -89.3905, address: 'Tamanique, La Libertad', description: 'Una de las playas más emblemáticas para el surf de olas largas y derechas. Perfecta para surfistas de todos los niveles.', history: 'Fue una de las primeras playas en El Salvador en atraer la atención de campeones mundiales de surf en la década de 1970.', services: ['clases de surf', 'restaurantes', 'renta de tablas'], rating: 4.7, featured: true, verified: true, parking: true },
  { name: 'Playa El Majahual', dept: 'LL', muni: 'La Libertad Costa', category: 'Playas', tags: ['playa-familiar', 'gastronomia-tipica', 'mariscos'], lat: 13.4902, lng: -89.3664, address: 'La Libertad, La Libertad', description: 'Playa de ambiente vibrante y sumamente popular entre las familias salvadoreñas, conocida por sus extensas ramadas y mariscos frescos a precios accesibles.', services: ['restaurantes', 'ranchos', 'alquiler de hamacas'], rating: 4.1, parking: true, petFriendly: true },
  { name: 'Playa San Blas', dept: 'LL', muni: 'La Libertad Costa', category: 'Playas', tags: ['playa-familiar', 'surf', 'romantico'], lat: 13.4886, lng: -89.3512, address: 'La Libertad, La Libertad', description: 'Complejo de playa con amplias franjas de arena, olas moderadas ideales para bodyboard y clubes de playa privados y públicos.', services: ['club de playa', 'restaurantes', 'hospedaje'], rating: 4.4, verified: true, parking: true },
  { name: 'Playa Las Flores', dept: 'US', muni: 'Usulután Este', category: 'Playas', tags: ['surf', 'playa-surf'], lat: 13.1789, lng: -88.3572, address: 'Jucuarán, Usulután', description: 'Playa de oleaje derecho de gran calidad ubicada en la costa oriental, apreciada por surfistas por su tubo consistente.', services: ['surf', 'hospedaje boutique'], rating: 4.6, verified: true },
  { name: 'Playa El Cuco', dept: 'SM', muni: 'San Miguel Oeste', category: 'Playas', tags: ['surf', 'playa-familiar'], lat: 13.1867, lng: -88.0964, address: 'Chirilagua, San Miguel', description: 'Una de las playas más extensas del oriente salvadoreño, con oleaje apto tanto para surf como para descanso familiar.', services: ['restaurantes', 'hospedaje'], rating: 4.3, parking: true },
  { name: 'Playa Costa del Sol', dept: 'LP', muni: 'La Paz Este', category: 'Playas', tags: ['playa-familiar', 'gastronomia'], lat: 13.3242, lng: -88.9014, address: 'San Luis La Herradura, La Paz', description: 'Extenso balneario de arena oscura en la Bahía de Jiquilisco, tradicionalmente uno de los destinos de playa más visitados por familias salvadoreñas.', services: ['restaurantes', 'ranchos', 'hospedaje'], rating: 4.2, parking: true, petFriendly: true },
  { name: 'Playa Mizata', dept: 'LL', muni: 'La Libertad Costa', category: 'Playas', tags: ['surf'], lat: 13.47, lng: -89.55, address: 'Jicalapa, La Libertad', description: 'Playa de surf poco masificada dentro de Surf City, con un point break apreciado por surfistas experimentados.', services: ['surf'], rating: 4.3 },
  { name: 'Playa San Diego', dept: 'LL', muni: 'La Libertad Costa', category: 'Playas', tags: ['playa-familiar'], lat: 13.485, lng: -89.415, address: 'Chiltiupán, La Libertad', description: 'Playa tranquila cercana a El Zonte, con oleaje moderado y menor afluencia turística.', services: ['restaurantes'], rating: 4.1 },
  { name: 'Playa Las Tunas', dept: 'UN', muni: 'La Unión Sur', category: 'Playas', tags: ['playa-familiar', 'mariscos', 'fotografia'], lat: 13.1558, lng: -87.9547, address: 'Conchagua, La Unión', description: 'Playa de arena oscura y exóticas formaciones rocosas que crean piscinas naturales durante la marea baja. Destino muy popular en la zona oriental.', services: ['ranchos', 'mariscos', 'hospedaje basico'], rating: 4.3, parking: true },
  { name: 'Playa El Tamarindo', dept: 'UN', muni: 'La Unión Sur', category: 'Playas', tags: ['playa-familiar', 'pesca', 'manglar'], lat: 13.1467, lng: -87.9011, address: 'Conchagua, La Unión', description: 'Playa tipo estero de aguas sumamente tranquilas, casi sin olas, ideal para nadar de forma segura. Conecta con zonas de manglar.', services: ['tours en lancha', 'pesca', 'restaurantes'], rating: 4.5, verified: true, parking: true },
  { name: 'Playa Maculís', dept: 'UN', muni: 'La Unión Sur', category: 'Playas', tags: ['playa-familiar', 'romantico', 'atardecer'], lat: 13.1528, lng: -87.9369, address: 'Conchagua, La Unión', description: 'Considerada una de las playas más hermosas y tranquilas de El Salvador, con arenas doradas y un ambiente apartado ideal para la relajación.', services: ['hospedaje boutique', 'restaurantes'], rating: 4.7, featured: true, verified: true },
  { name: 'Playa Los Cóbanos', dept: 'SO', muni: 'Sonsonate Centro', category: 'Playas', tags: ['buceo', 'aves', 'ecoturismo'], lat: 13.5333, lng: -89.85, address: 'Acajutla, Sonsonate', description: 'Único arrecife rocoso natural en el Pacífico salvadoreño y área natural protegida, popular para buceo y esnórquel.', services: ['buceo', 'esnorquel', 'tours en lancha'], rating: 4.5, verified: true, featured: true },
  { name: 'Playa Los Almendros', dept: 'SO', muni: 'Sonsonate Oeste', category: 'Playas', tags: ['fotografia', 'naturaleza', 'camping'], lat: 13.5511, lng: -89.8805, address: 'Acajutla, Sonsonate', description: 'Ubicada dentro del Área Natural Protegida Los Cóbanos, es una playa prístina de coral triturado, famosa por sus piscinas naturales.', services: ['senderos', 'zonas de camping'], rating: 4.6, parking: true },
  { name: 'Barra de Santiago', dept: 'AH', muni: 'Ahuachapán Sur', category: 'Playas', tags: ['manglar', 'ecoturismo', 'aves'], lat: 13.7167, lng: -90.0167, address: 'Jujutla, Ahuachapán', description: 'Complejo de playa y manglar declarado sitio Ramsar, con canales navegables ideales para observación de aves y tours de manglar.', services: ['tours en lancha', 'observacion de aves'], rating: 4.5, verified: true },
  { name: 'Playa El Espino', dept: 'US', muni: 'Usulután Este', category: 'Playas', tags: ['playa-familiar', 'ecoturismo'], lat: 13.1667, lng: -88.4, address: 'Jiquilisco, Usulután', description: 'Playa extensa cercana a la desembocadura del río Lempa, con anidación de tortugas marinas.', services: ['avistamiento de tortugas'], rating: 4.1 },

  // --- VOLCANES ---
  { name: 'Volcán de Santa Ana (Ilamatepec)', dept: 'SA', muni: 'Santa Ana Oeste', category: 'Volcanes', tags: ['senderismo', 'mirador', 'volcanico', 'aventura'], lat: 13.8533, lng: -89.6297, address: 'Parque Nacional Los Volcanes, Santa Ana', description: 'El volcán activo más alto de El Salvador, con una laguna cratérica turquesa visible desde la cima tras un ascenso guiado de aproximadamente dos horas.', services: ['senderismo guiado', 'guias certificados'], rating: 4.8, featured: true, verified: true, parking: true },
  { name: 'Volcán de Izalco', dept: 'SO', muni: 'Sonsonate Norte', category: 'Volcanes', tags: ['senderismo', 'mirador', 'volcanico'], lat: 13.8144, lng: -89.6317, address: 'Parque Nacional Los Volcanes, Sonsonate', description: 'Conocido históricamente como el "Faro del Pacífico" por su actividad eruptiva constante entre 1770 y 1958, visible desde el mar.', services: ['senderismo guiado'], rating: 4.6, verified: true },
  { name: 'Volcán de San Salvador (Boquerón)', dept: 'SS', muni: 'San Salvador Oeste', category: 'Volcanes', tags: ['senderismo', 'mirador'], lat: 13.7333, lng: -89.2833, address: 'Parque Nacional El Boquerón, San Salvador', description: 'Cráter de más de un kilómetro de diámetro con senderos accesibles y vistas hacia el Área Metropolitana de San Salvador.', services: ['senderos', 'miradores', 'guias'], rating: 4.5, verified: true, parking: true },
  { name: 'Volcán de San Miguel (Chaparrastique)', dept: 'SM', muni: 'San Miguel Centro', category: 'Volcanes', tags: ['senderismo', 'volcanico'], lat: 13.4342, lng: -88.2694, address: 'San Miguel', description: 'Uno de los volcanes más activos del país, visible desde gran parte del oriente salvadoreño.', services: ['senderismo guiado'], rating: 4.3 },
  { name: 'Volcán de Conchagua', dept: 'UN', muni: 'La Unión Sur', category: 'Volcanes', tags: ['senderismo', 'mirador'], lat: 13.2761, lng: -87.7508, address: 'Conchagua, La Unión', description: 'Volcán que domina el paisaje del Golfo de Fonseca, con vistas hacia Honduras y Nicaragua desde su cima. Ofrece miradores espectaculares.', services: ['senderismo', 'camping'], rating: 4.6, verified: true },
  { name: 'Volcán y Laguna de Alegría (Tecapa)', dept: 'US', muni: 'Usulután Norte', category: 'Volcanes', tags: ['senderismo', 'mirador', 'aguas-termales'], lat: 13.5006, lng: -88.4931, address: 'Alegría, Usulután', description: 'Cráter con una laguna de tonos turquesa por su contenido de azufre, ubicado junto al pintoresco pueblo de Alegría.', services: ['miradores', 'senderos'], rating: 4.6, featured: true },
  { name: 'Volcán de San Vicente (Chinchontepec)', dept: 'SV', muni: 'San Vicente Sur', category: 'Volcanes', tags: ['senderismo', 'volcanico', 'aventura'], lat: 13.595, lng: -88.8375, address: 'Guadalupe, San Vicente', description: 'Imponente volcán de dos picos que se eleva sobre el valle de Jiboa. El ascenso requiere buena condición física y permite vistas de todo el territorio paracentral.', services: ['senderismo guiado'], rating: 4.5, verified: true },

  // --- LAGOS Y LAGUNAS ---
  { name: 'Lago de Coatepeque', dept: 'SA', muni: 'Santa Ana Este', category: 'Lagos y Lagunas', tags: ['lago', 'atardecer', 'familia', 'kayak'], lat: 13.8667, lng: -89.55, address: 'El Congo, Santa Ana', description: 'Lago cratérico de aguas color turquesa rodeado de casas de descanso, clubes privados y restaurantes con vista al agua.', services: ['kayak', 'lanchas', 'restaurantes'], rating: 4.5, featured: true, verified: true, parking: true },
  { name: 'Lago de Ilopango', dept: 'SS', muni: 'San Salvador Este', category: 'Lagos y Lagunas', tags: ['lago', 'kayak', 'pesca'], lat: 13.6833, lng: -89.05, address: 'Ilopango, San Salvador', description: 'El lago natural más grande de El Salvador, formado en una caldera volcánica, con miradores y clubes recreativos en sus orillas.', services: ['lanchas', 'miradores'], rating: 4.2, parking: true },
  { name: 'Lago de Suchitlán', dept: 'CH', muni: 'Chalatenango Sur', category: 'Lagos y Lagunas', tags: ['lago', 'aves', 'ecoturismo', 'atardecer'], lat: 13.9333, lng: -89.0333, address: 'Suchitoto, Cuscatlán/Chalatenango', description: 'Embalse artificial más grande del país sobre el río Lempa, reconocido por sus atardeceres y como sitio Ramsar para aves migratorias.', services: ['tours en lancha', 'avistamiento de aves'], rating: 4.6, featured: true, verified: true },
  { name: 'Laguna de Alegría', dept: 'US', muni: 'Usulután Norte', category: 'Lagos y Lagunas', tags: ['lago', 'mirador'], lat: 13.5006, lng: -88.4931, address: 'Alegría, Usulután', description: 'Laguna cratérica de tonalidad turquesa dentro del volcán de Tecapa.', services: ['miradores'], rating: 4.4 },
  { name: 'Laguna de Olomega', dept: 'SM', muni: 'San Miguel Oeste', category: 'Lagos y Lagunas', tags: ['lago', 'pesca', 'aves'], lat: 13.2167, lng: -87.9667, address: 'San Miguel / La Unión', description: 'Laguna natural de agua dulce compartida entre San Miguel y La Unión, importante para la pesca artesanal y aves acuáticas.', services: ['tours en lancha', 'pesca'], rating: 4.1 },
  { name: 'Laguna Verde de Ahuachapán', dept: 'AH', muni: 'Ahuachapán Centro', category: 'Lagos y Lagunas', tags: ['senderismo', 'volcanico'], lat: 13.9, lng: -89.85, address: 'Ahuachapán', description: 'Pequeña laguna cratérica de color verde intenso, accesible mediante una caminata corta desde los ausoles cercanos.', services: ['senderos'], rating: 4.2 },
  { name: 'Laguna de Metapán / Güija', dept: 'SA', muni: 'Santa Ana Norte', category: 'Lagos y Lagunas', tags: ['lago', 'aves', 'ecoturismo'], lat: 14.1333, lng: -89.4667, address: 'Metapán, Santa Ana', description: 'Lago binacional compartido con Guatemala, dentro de la Reserva de la Biosfera Trifinio-Fraternidad, rico en biodiversidad acuática.', services: ['tours en lancha'], rating: 4.3, verified: true },
  { name: 'Laguna de Apastepeque', dept: 'SV', muni: 'San Vicente Norte', category: 'Lagos y Lagunas', tags: ['lago', 'familia', 'gastronomia'], lat: 13.6702, lng: -88.7511, address: 'Apastepeque, San Vicente', description: 'Hermosa laguna de origen volcánico rodeada de restaurantes y un turicentro. Ideal para relajarse y degustar platillos típicos.', services: ['restaurantes', 'piscinas', 'muelles'], rating: 4.4, parking: true },

  // --- RÍOS Y CASCADAS ---
  { name: 'Los Chorros de la Calera', dept: 'LL', muni: 'La Libertad Norte', category: 'Ríos y Cascadas', tags: ['rio', 'familia', 'turicentro'], lat: 13.75, lng: -89.4, address: 'Nuevo Cuscatlán / Antiguo Cuscatlán, La Libertad', description: 'Centro recreativo tradicional con piscinas alimentadas por manantiales naturales, popular entre familias salvadoreñas desde mediados del siglo XX.', services: ['piscinas', 'ranchos', 'restaurantes'], rating: 4.0, parking: true, petFriendly: true },
  { name: 'Los Siete Chorros (Juayúa)', dept: 'SO', muni: 'Sonsonate Este', category: 'Ríos y Cascadas', tags: ['cascada', 'senderismo', 'aventura'], lat: 13.85, lng: -89.75, address: 'Juayúa, Sonsonate', description: 'Conjunto de siete caídas de agua accesibles mediante una caminata guiada por bosque nuboso en la Ruta de Las Flores.', services: ['senderismo guiado', 'guias locales'], rating: 4.6, verified: true, featured: true },
  { name: 'Cascada Don Juan', dept: 'SO', muni: 'Sonsonate Este', category: 'Ríos y Cascadas', tags: ['cascada', 'aventura'], lat: 13.845, lng: -89.755, address: 'Juayúa, Sonsonate', description: 'Cascada de gran caudal cercana a Juayúa, con área para nadar en su poza natural.', services: ['guias locales'], rating: 4.4 },
  { name: 'Cascada de Tepechapa', dept: 'AH', muni: 'Ahuachapán Sur', category: 'Ríos y Cascadas', tags: ['cascada', 'senderismo'], lat: 13.85, lng: -89.9667, address: 'Tacuba, Ahuachapán', description: 'Una de las cascadas del recorrido "El Imposible - Tacuba", con varias caídas de agua conectadas por senderos de montaña.', services: ['senderismo guiado', 'campamentos'], rating: 4.5 },
  { name: 'Río Sapo', dept: 'MO', muni: 'Morazán Norte', category: 'Ríos y Cascadas', tags: ['rio', 'aventura', 'ecoturismo'], lat: 13.95, lng: -88.1667, address: 'Cacaopera / Corinto, Morazán', description: 'Río de aguas cristalinas dentro de un cañón rocoso en el norte de Morazán, con pozas naturales para nadar.', services: ['guias locales'], rating: 4.5 },
  { name: 'Río Sensunapán', dept: 'SO', muni: 'Sonsonate Centro', category: 'Ríos y Cascadas', tags: ['rio'], lat: 13.72, lng: -89.72, address: 'Sonsonate', description: 'Río que atraviesa la ciudad de Sonsonate, históricamente asociado al desarrollo agrícola e industrial de la zona.', services: [], rating: 3.9 },
  { name: 'Salto de Malacatiupán', dept: 'SA', muni: 'Santa Ana Oeste', category: 'Ríos y Cascadas', tags: ['cascada', 'aguas-termales', 'aventura'], lat: 13.9298, lng: -89.7265, address: 'Atiquizaya, Santa Ana', description: 'Única cascada de aguas termales en el país, ofreciendo una experiencia inigualable al nadar en sus tibias pozas rodeadas de naturaleza salvaje.', services: ['senderismo', 'pozas naturales'], rating: 4.7, featured: true, verified: true },
  { name: 'Cascada Los Tercios', dept: 'CU', muni: 'Cuscatlán Norte', category: 'Ríos y Cascadas', tags: ['cascada', 'fotografia', 'aventura'], lat: 13.9456, lng: -89.0135, address: 'Suchitoto, Cuscatlán', description: 'Famosa por su singular pared de rocas hexagonales formadas por magma petrificado. Dependiendo de la temporada, la cascada puede estar seca o fluir libremente.', services: ['senderismo corto'], rating: 4.4, verified: true },
  { name: 'Cascada El Escuco', dept: 'SO', muni: 'Sonsonate Este', category: 'Ríos y Cascadas', tags: ['cascada', 'aventura', 'senderismo'], lat: 13.785, lng: -89.658, address: 'Santo Domingo de Guzmán, Sonsonate', description: 'Impresionante salto de agua de 80 metros de altura en una zona rica en tradiciones indígenas e historia artesanal.', services: ['senderismo', 'rapel'], rating: 4.5 },
  
  // --- PARQUES NACIONALES Y RESERVAS ---
  { name: 'Parque Nacional El Imposible', dept: 'AH', muni: 'Ahuachapán Sur', category: 'Parques Nacionales', tags: ['ecoturismo', 'senderismo', 'aves', 'naturaleza'], lat: 13.8333, lng: -89.9667, address: 'Tacuba / San Francisco Menéndez, Ahuachapán', description: 'El área protegida más grande y biodiversa de El Salvador, con más de 500 especies de árboles y cientos de especies de aves.', services: ['senderos interpretativos', 'guias', 'camping'], rating: 4.8, featured: true, verified: true },
  { name: 'Parque Nacional Montecristo (Trifinio)', dept: 'SA', muni: 'Santa Ana Norte', category: 'Parques Nacionales', tags: ['ecoturismo', 'senderismo', 'naturaleza'], lat: 14.4167, lng: -89.35, address: 'Metapán, Santa Ana', description: 'Bosque nuboso en el punto donde convergen El Salvador, Guatemala y Honduras, con árboles centenarios cubiertos de musgo.', services: ['senderos', 'guias', 'jardin de orquideas'], rating: 4.7, verified: true },
  { name: 'Parque Nacional Walter Thilo Deininger', dept: 'LL', muni: 'La Libertad Este', category: 'Parques Nacionales', tags: ['ecoturismo', 'senderismo', 'aventura'], lat: 13.5167, lng: -89.2167, address: 'Zaragoza, La Libertad', description: 'Área protegida modernizada con centro de interpretación, puentes colgantes, canopy y senderos que atraviesan bosque tropical seco.', services: ['senderos', 'canopy', 'centro de visitantes', 'guias'], rating: 4.6, verified: true, parking: true },
  { name: 'Reserva de Biosfera Apaneca-Ilamatepec', dept: 'AH', muni: 'Ahuachapán Centro', category: 'Reservas Naturales', tags: ['ecoturismo', 'cafe-de-altura', 'naturaleza'], lat: 13.87, lng: -89.8, address: 'Apaneca, Ahuachapán', description: 'Reserva declarada por la UNESCO que protege bosques cafetaleros de altura y remanentes de bosque nuboso en la cordillera Apaneca-Ilamatepec.', services: ['tours de cafe', 'senderismo'], rating: 4.5, verified: true },
  { name: 'Reserva Ecológica Cinquera', dept: 'CA', muni: 'Cabañas Oeste', category: 'Reservas Naturales', tags: ['ecoturismo', 'senderismo', 'guerra-civil'], lat: 13.9, lng: -88.9333, address: 'Cinquera, Cabañas', description: 'Bosque regenerado tras la guerra civil, con senderos que combinan naturaleza e historia del conflicto armado salvadoreño.', services: ['senderismo guiado', 'museo comunitario'], rating: 4.3 },
  { name: 'Bahía de Jiquilisco', dept: 'US', muni: 'Usulután Este', category: 'Reservas Naturales', tags: ['manglar', 'ecoturismo', 'aves', 'humedal'], lat: 13.25, lng: -88.55, address: 'Puerto El Triunfo, Usulután', description: 'La reserva de manglar más grande de El Salvador y sitio Ramsar, hogar de tortugas marinas y numerosas especies de aves acuáticas.', services: ['tours en lancha', 'avistamiento de tortugas'], rating: 4.6, verified: true, featured: true },
  { name: 'Desembocadura del Río Lempa', dept: 'US', muni: 'Usulután Este', category: 'Reservas Naturales', tags: ['manglar', 'ecoturismo', 'aves'], lat: 13.2333, lng: -88.4667, address: 'Jiquilisco, Usulután', description: 'Zona húmeda en la desembocadura del río más largo de Centroamérica, hábitat de aves migratorias y tortugas marinas.', services: ['tours en lancha'], rating: 4.3 },
  { name: 'Grutas de El Espino', dept: 'AH', muni: 'Ahuachapán Sur', category: 'Reservas Naturales', tags: ['grutas', 'senderismo'], lat: 13.78, lng: -89.9, address: 'Jujutla, Ahuachapán', description: 'Formaciones de cuevas naturales dentro del área de influencia del Parque Nacional El Imposible.', services: ['senderismo guiado'], rating: 4.0 },

  // --- ZONAS ARQUEOLÓGICAS MAYAS E HISTORIA ---
  { name: 'Joya de Cerén', dept: 'LL', muni: 'La Libertad Norte', category: 'Zonas Arqueológicas Mayas', tags: ['maya', 'patrimonio', 'historia'], lat: 13.8258, lng: -89.3653, address: 'San Juan Opico, La Libertad', description: 'Sitio Patrimonio de la Humanidad por la UNESCO, conocido como la "Pompeya de América" por conservar una aldea maya sepultada por ceniza volcánica hacia el año 600 d.C.', history: 'Descubierto en 1976, es el único sitio arqueológico de El Salvador inscrito en la Lista del Patrimonio Mundial de la UNESCO.', services: ['museo de sitio', 'guias', 'tienda de souvenirs'], rating: 4.7, featured: true, verified: true, parking: true },
  { name: 'Sitio Arqueológico de Tazumal', dept: 'SA', muni: 'Santa Ana Oeste', category: 'Zonas Arqueológicas Mayas', tags: ['maya', 'patrimonio', 'historia'], lat: 13.9758, lng: -89.6742, address: 'Chalchuapa, Santa Ana', description: 'Uno de los conjuntos arqueológicos mayas más grandes y mejor conservados de El Salvador, con una pirámide principal de más de 20 escalones de altura.', services: ['museo de sitio', 'guias'], rating: 4.6, featured: true, verified: true },
  { name: 'Sitio Arqueológico Casa Blanca', dept: 'SA', muni: 'Santa Ana Oeste', category: 'Zonas Arqueológicas Mayas', tags: ['maya', 'patrimonio', 'artesanias'], lat: 13.9822, lng: -89.6822, address: 'Chalchuapa, Santa Ana', description: 'Complejo arqueológico con talleres demostrativos de elaboración tradicional de añil (índigo).', services: ['museo de sitio', 'taller de anil'], rating: 4.4, verified: true },
  { name: 'Sitio Arqueológico San Andrés', dept: 'LL', muni: 'La Libertad Norte', category: 'Zonas Arqueológicas Mayas', tags: ['maya', 'patrimonio'], lat: 13.8106, lng: -89.3922, address: 'Ciudad Arce, La Libertad', description: 'Antiguo centro administrativo maya del valle de Zapotitán, con estructuras piramidales y un museo de sitio.', services: ['museo de sitio', 'guias'], rating: 4.4, verified: true },
  { name: 'Sitio Arqueológico Cihuatán', dept: 'SS', muni: 'San Salvador Norte', category: 'Zonas Arqueológicas Mayas', tags: ['maya', 'patrimonio'], lat: 13.95, lng: -89.1167, address: 'Aguilares, San Salvador', description: 'La ciudad prehispánica más extensa de El Salvador, con canchas de juego de pelota y templos piramidales.', services: ['senderos', 'guias', 'museo de sitio'], rating: 4.3, verified: true },
  { name: 'Complejo Arqueológico El Trapiche', dept: 'SA', muni: 'Santa Ana Oeste', category: 'Zonas Arqueológicas Mayas', tags: ['maya', 'patrimonio'], lat: 13.9833, lng: -89.6833, address: 'Chalchuapa, Santa Ana', description: 'Parte del conjunto arqueológico de Chalchuapa, con montículos y estructuras habitacionales prehispánicas.', services: ['guias'], rating: 4.0 },
  { name: 'Ruinas de Quelepa', dept: 'SM', muni: 'San Miguel Centro', category: 'Sitios Arqueológicos', tags: ['historia', 'patrimonio'], lat: 13.483, lng: -88.233, address: 'Quelepa, San Miguel', description: 'Importante sitio arqueológico precolombino en el este del país, que muestra vínculos culturales con grupos Lenca y mesoamericanos.', services: ['guias locales'], rating: 4.1 },
  { name: 'Cueva del Espíritu Santo', dept: 'MO', muni: 'Morazán Norte', category: 'Sitios Arqueológicos', tags: ['historia', 'patrimonio', 'petroglifos'], lat: 13.8122, lng: -87.9719, address: 'Corinto, Morazán', description: 'Abrigo rocoso que contiene importantes pinturas rupestres y petroglifos precolombinos de diversas eras.', services: ['guias', 'senderos'], rating: 4.5, verified: true },
  { name: 'Sitio Histórico El Mozote', dept: 'MO', muni: 'Morazán Norte', category: 'Sitios Arqueológicos', tags: ['guerra-civil', 'historia'], lat: 13.9903, lng: -88.15, address: 'Meanguera, Morazán', description: 'Memorial en el sitio donde ocurrió una de las masacres más documentadas del conflicto armado salvadoreño en 1981.', services: ['memorial', 'guias comunitarios'], rating: 4.6, verified: true },

  // --- PUEBLOS TURÍSTICOS ---
  { name: 'Suchitoto', dept: 'CU', muni: 'Cuscatlán Norte', category: 'Pueblos Turísticos', tags: ['colonial', 'centro-historico', 'arquitectura', 'cultura-viva'], lat: 13.9381, lng: -89.0275, address: 'Suchitoto, Cuscatlán', description: 'Pueblo colonial de calles empedradas junto al Lago de Suchitlán, reconocido como uno de los centros culturales más importantes del país, con galerías de arte y festivales permanentes.', services: ['galerias de arte', 'restaurantes', 'hospedaje boutique'], rating: 4.7, featured: true, verified: true, parking: true, wifi: true },
  { name: 'Concepción de Ataco', dept: 'AH', muni: 'Ahuachapán Centro', category: 'Pueblos Turísticos', tags: ['colonial', 'mural', 'cafe-de-altura', 'artesanias'], lat: 13.8722, lng: -89.8433, address: 'Concepción de Ataco, Ahuachapán', description: 'Pueblo de la Ruta de Las Flores famoso por sus fachadas de colores vivos, murales artísticos y fincas de café de altura en los alrededores.', services: ['tours de cafe', 'restaurantes', 'artesanias'], rating: 4.7, featured: true, verified: true, parking: true },
  { name: 'Apaneca', dept: 'AH', muni: 'Ahuachapán Centro', category: 'Pueblos Turísticos', tags: ['cafe-de-altura', 'aventura', 'tirolesa'], lat: 13.8506, lng: -89.7994, address: 'Apaneca, Ahuachapán', description: 'El pueblo más alto de El Salvador, rodeado de fincas cafetaleras, con actividades de aventura como canopy y ciclismo de montaña.', services: ['tirolesa', 'tours de cafe', 'hospedaje'], rating: 4.6, featured: true, verified: true },
  { name: 'Juayúa', dept: 'SO', muni: 'Sonsonate Este', category: 'Pueblos Turísticos', tags: ['gastronomia', 'feria-patronal', 'cafe-de-altura'], lat: 13.8425, lng: -89.7461, address: 'Juayúa, Sonsonate', description: 'Conocido por su Feria Gastronómica de fin de semana, ubicado en el corazón de la Ruta de Las Flores.', services: ['feria gastronomica', 'tours de cafe'], rating: 4.6, featured: true, verified: true, parking: true },
  { name: 'Salcoatitán', dept: 'SO', muni: 'Sonsonate Este', category: 'Pueblos Turísticos', tags: ['artesanias', 'cafe-de-altura'], lat: 13.8383, lng: -89.7328, address: 'Salcoatitán, Sonsonate', description: 'El pueblo más pequeño de la Ruta de Las Flores, conocido por sus artesanías y bordados tradicionales.', services: ['artesanias'], rating: 4.3 },
  { name: 'Nahuizalco', dept: 'SO', muni: 'Sonsonate Este', category: 'Pueblos Turísticos', tags: ['artesanias', 'mercado-nocturno', 'indigena'], lat: 13.7739, lng: -89.7358, address: 'Nahuizalco, Sonsonate', description: 'Pueblo de tradición indígena reconocido por sus artesanías en mimbre, tule y bambú, y su mercado nocturno iluminado con candelas.', services: ['artesanias', 'mercado nocturno'], rating: 4.4, verified: true },
  { name: 'La Palma', dept: 'CH', muni: 'Chalatenango Norte', category: 'Pueblos Turísticos', tags: ['artesanias', 'mural', 'naive-art'], lat: 14.3167, lng: -89.1667, address: 'La Palma, Chalatenango', description: 'Cuna del movimiento artístico naif salvadoreño impulsado por Fernando Llort, conocido por sus talleres de artesanía pintada a mano.', services: ['talleres de arte', 'artesanias'], rating: 4.5, verified: true },
  { name: 'Panchimalco', dept: 'SS', muni: 'San Salvador Sur', category: 'Pueblos Turísticos', tags: ['religioso', 'indigena', 'feria-patronal'], lat: 13.6167, lng: -89.1833, address: 'Panchimalco, San Salvador', description: 'Pueblo de fuerte herencia indígena pipil, conocido por la Iglesia de Santa Cruz de Roma y la festividad de las Flores y las Palmas.', services: ['artesanias'], rating: 4.4, verified: true },
  { name: 'Perquín', dept: 'MO', muni: 'Morazán Norte', category: 'Pueblos Turísticos', tags: ['guerra-civil', 'senderismo', 'museo'], lat: 13.9667, lng: -88.1667, address: 'Perquín, Morazán', description: 'Pueblo montañoso en la ex zona de conflicto, sede del Museo de la Revolución Salvadoreña y punto de partida hacia El Mozote.', services: ['museo', 'senderismo'], rating: 4.5, verified: true },

  // --- CULTURA, HISTORIA Y CIUDAD ---
  { name: 'Centro Histórico de San Salvador', dept: 'SS', muni: 'San Salvador Centro', category: 'Centros Históricos', tags: ['centro-historico', 'arquitectura', 'historia'], lat: 13.6983, lng: -89.1917, address: 'San Salvador', description: 'El núcleo fundacional de la capital, completamente renovado y lleno de plazas, museos, iglesias y edificios emblemáticos como el Palacio Nacional.', services: ['plazas', 'restaurantes', 'museos'], rating: 4.8, featured: true, verified: true, parking: true, wifi: true },
  { name: 'Palacio Nacional', dept: 'SS', muni: 'San Salvador Centro', category: 'Museos', tags: ['centro-historico', 'arquitectura', 'historia'], lat: 13.6983, lng: -89.1917, address: 'Centro Histórico, San Salvador', description: 'Antigua sede de los tres poderes del Estado, hoy convertido en museo y espacio cultural con impresionantes salones temáticos (Rojo, Amarillo, Rosado, Azul).', services: ['museo', 'tours guiados'], rating: 4.6, verified: true },
  { name: 'Teatro Nacional de San Salvador', dept: 'SS', muni: 'San Salvador Centro', category: 'Centros Culturales', tags: ['centro-historico', 'arquitectura', 'cultura-viva'], lat: 13.6983, lng: -89.1908, address: 'Centro Histórico, San Salvador', description: 'El teatro más antiguo de Centroamérica en funcionamiento, con una fachada de estilo neoclásico francés.', services: ['funciones culturales', 'tours guiados'], rating: 4.5, verified: true },
  { name: 'Catedral Metropolitana de San Salvador', dept: 'SS', muni: 'San Salvador Centro', category: 'Iglesias y Templos', tags: ['religioso', 'centro-historico', 'arquitectura'], lat: 13.6989, lng: -89.1914, address: 'Centro Histórico, San Salvador', description: 'Sede de la Arquidiócesis de San Salvador y lugar de descanso de Monseñor Óscar Arnulfo Romero, canonizado en 2018.', services: [], rating: 4.5, verified: true, parking: true },
  { name: 'Iglesia El Rosario', dept: 'SS', muni: 'San Salvador Centro', category: 'Iglesias y Templos', tags: ['religioso', 'arquitectura', 'mural'], lat: 13.6981, lng: -89.1908, address: 'Centro Histórico, San Salvador', description: 'Reconocida por su espectacular arquitectura brutalista y sus vitrales de colores que crean un arcoíris en el interior.', services: [], rating: 4.7, featured: true, verified: true },
  { name: 'Plaza Libertad', dept: 'SS', muni: 'San Salvador Centro', category: 'Parques Urbanos', tags: ['centro-historico', 'historia'], lat: 13.6980, lng: -89.1900, address: 'Centro Histórico, San Salvador', description: 'Plaza fundacional que conmemora la independencia centroamericana con el Monumento a los Próceres.', services: ['areas de descanso'], rating: 4.5, verified: true },
  { name: 'Plaza Gerardo Barrios', dept: 'SS', muni: 'San Salvador Centro', category: 'Parques Urbanos', tags: ['centro-historico', 'historia'], lat: 13.6985, lng: -89.1915, address: 'Centro Histórico, San Salvador', description: 'La plaza central de la ciudad, flanqueada por el Palacio Nacional y la Catedral Metropolitana, escenario principal de eventos cívicos.', services: ['cafeterias cercanas'], rating: 4.6, verified: true },
  { name: 'Monumento al Divino Salvador del Mundo', dept: 'SS', muni: 'San Salvador Centro', category: 'Centros Históricos', tags: ['fotografia', 'centro-historico'], lat: 13.7008, lng: -89.2264, address: 'Plaza Salvador del Mundo, San Salvador', description: 'Monumento emblemático de la capital salvadoreña, punto de referencia central y sede de celebraciones cívicas.', services: [], rating: 4.4, parking: true },
  { name: 'Basílica de la Virgen de Guadalupe', dept: 'LL', muni: 'La Libertad Este', category: 'Iglesias y Templos', tags: ['religioso', 'arquitectura'], lat: 13.6800, lng: -89.2450, address: 'Antiguo Cuscatlán, La Libertad', description: 'Templo imponente dedicado a la patrona de América Latina, sede de peregrinaciones cada diciembre.', services: ['parqueo'], rating: 4.6, parking: true },
  { name: 'Centro Histórico de Santa Ana', dept: 'SA', muni: 'Santa Ana Centro', category: 'Centros Históricos', tags: ['colonial', 'arquitectura', 'centro-historico'], lat: 13.9942, lng: -89.559, address: 'Santa Ana', description: 'Casco urbano con el Teatro de Santa Ana, la Catedral de estilo gótico y edificios de arquitectura ecléctica del siglo XIX y XX.', services: ['plazas', 'restaurantes'], rating: 4.3, parking: true },
  { name: 'Teatro de Santa Ana', dept: 'SA', muni: 'Santa Ana Centro', category: 'Centros Culturales', tags: ['centro-historico', 'arquitectura', 'cultura-viva'], lat: 13.9944, lng: -89.5592, address: 'Santa Ana', description: 'Teatro de estilo renacentista considerado uno de los edificios más elegantes del país, restaurado tras décadas de deterioro.', services: ['funciones culturales', 'tours guiados'], rating: 4.7, verified: true },
  { name: 'Catedral de Santa Ana', dept: 'SA', muni: 'Santa Ana Centro', category: 'Iglesias y Templos', tags: ['religioso', 'arquitectura'], lat: 13.994, lng: -89.5588, address: 'Santa Ana', description: 'Catedral de estilo neogótico, una de las más fotografiadas del país por su espectacular fachada blanca ornamentada.', services: [], rating: 4.6, featured: true },
  { name: 'Nueva San Salvador (Santa Tecla) Centro Histórico', dept: 'LL', muni: 'La Libertad Centro', category: 'Centros Históricos', tags: ['centro-historico', 'gastronomia'], lat: 13.6769, lng: -89.2797, address: 'Santa Tecla, La Libertad', description: 'Centro histórico reconstruido tras el terremoto de 2001, con el Parque Daniel Hernández, el Teatro Municipal y el Paseo El Carmen.', services: ['restaurantes', 'plazas'], rating: 4.3, parking: true },
  { name: 'Paseo El Carmen', dept: 'LL', muni: 'La Libertad Centro', category: 'Rutas Turísticas', tags: ['vida-nocturna', 'gastronomia', 'compras'], lat: 13.6740, lng: -89.2780, address: 'Santa Tecla, La Libertad', description: 'Corredor peatonal lleno de bares, cafés, restaurantes y artesanías, epicentro de la vida nocturna y cultural de Santa Tecla.', services: ['restaurantes', 'bares', 'musica en vivo'], rating: 4.4, verified: true },

  // --- MUSEOS Y PARQUES URBANOS ---
  { name: 'Museo Nacional de Antropología (MUNA)', dept: 'SS', muni: 'San Salvador Centro', category: 'Museos', tags: ['museo', 'historia', 'maya'], lat: 13.6994, lng: -89.2372, address: 'San Salvador', description: 'El principal museo antropológico del país, con colecciones que abarcan desde la época prehispánica hasta la actualidad.', services: ['exposiciones permanentes', 'tienda'], rating: 4.5, verified: true, parking: true },
  { name: 'Museo de Arte de El Salvador (MARTE)', dept: 'SS', muni: 'San Salvador Centro', category: 'Museos', tags: ['museo', 'arte'], lat: 13.6997, lng: -89.2372, address: 'San Salvador', description: 'Espacio dedicado al arte salvadoreño desde el siglo XIX hasta la producción contemporánea. Cuenta con obras maestras de artistas nacionales.', services: ['exposiciones temporales', 'cafe', 'tienda'], rating: 4.7, featured: true, verified: true, parking: true },
  { name: 'Museo de Historia Natural (MUHNES)', dept: 'SS', muni: 'San Salvador Sur', category: 'Museos', tags: ['museo', 'naturaleza'], lat: 13.6660, lng: -89.2000, address: 'Parque Saburo Hirao, San Salvador', description: 'Museo dedicado a la investigación y conservación de la biodiversidad y paleontología de El Salvador.', services: ['exposiciones', 'charlas'], rating: 4.2 },
  { name: 'Museo de la Palabra y la Imagen', dept: 'SS', muni: 'San Salvador Centro', category: 'Museos', tags: ['museo', 'guerra-civil', 'historia'], lat: 13.7028, lng: -89.2264, address: 'San Salvador', description: 'Centro documental dedicado a preservar la memoria histórica y cultural de El Salvador, con énfasis en el periodo del conflicto armado.', services: ['archivo', 'exposiciones'], rating: 4.4 },
  { name: 'Teatro Presidente', dept: 'SS', muni: 'San Salvador Centro', category: 'Centros Culturales', tags: ['cultura-viva', 'arquitectura'], lat: 13.6950, lng: -89.2390, address: 'San Salvador', description: 'El teatro con mayor aforo de la capital, sede de la Orquesta Sinfónica de El Salvador y escenario de espectáculos internacionales.', services: ['funciones', 'parqueo'], rating: 4.5, verified: true, parking: true },
  { name: 'Parque Cuscatlán', dept: 'SS', muni: 'San Salvador Centro', category: 'Parques Urbanos', tags: ['familia', 'guerra-civil'], lat: 13.6969, lng: -89.2153, address: 'San Salvador', description: 'Renovado parque urbano que alberga el Monumento a la Memoria y la Verdad, canchas deportivas, senderos peatonales y un centro cultural (Sala Nacional de Exposiciones).', services: ['areas verdes', 'monumento', 'canchas', 'cafeteria'], rating: 4.6, featured: true, verified: true, parking: true, wifi: true },
  { name: 'Parque Bicentenario', dept: 'SS', muni: 'San Salvador Oeste', category: 'Parques Urbanos', tags: ['familia', 'ciclismo', 'naturaleza'], lat: 13.7061, lng: -89.245, address: 'San Salvador', description: 'Uno de los parques urbanos y reservas ecológicas más grandes del Área Metropolitana, con senderos para caminar, correr y ciclovías exclusivas.', services: ['ciclovia', 'areas verdes', 'zonas de picnic'], rating: 4.7, verified: true, parking: true },
  { name: 'Parque Saburo Hirao', dept: 'SS', muni: 'San Salvador Sur', category: 'Parques Urbanos', tags: ['familia', 'naturaleza'], lat: 13.6650, lng: -89.1980, address: 'San Salvador', description: 'Parque recreativo rodeado de naturaleza con áreas de juego únicas y sede del Museo de Historia Natural.', services: ['juegos infantiles', 'museo', 'areas verdes'], rating: 4.3, parking: true },
  { name: 'Jardín Botánico La Laguna', dept: 'LL', muni: 'La Libertad Centro', category: 'Parques Urbanos', tags: ['naturaleza', 'familia', 'fotografia'], lat: 13.6689, lng: -89.2803, address: 'Antiguo Cuscatlán, La Libertad', description: 'Jardín botánico ubicado en el fondo de un antiguo cráter volcánico, con maravillosas colecciones de orquídeas, bromelias, estanques de agua y plantas tropicales.', services: ['senderos', 'invernaderos', 'cafeteria'], rating: 4.6, verified: true, parking: true },

  // --- MIRADORES Y TURICENTROS ---
  { name: 'Puerta del Diablo', dept: 'SS', muni: 'San Salvador Sur', category: 'Miradores', tags: ['mirador', 'senderismo', 'fotografia'], lat: 13.6236, lng: -89.1631, address: 'Panchimalco, San Salvador', description: 'Icónica formación rocosa partida en dos con pasarelas de cristal y miradores recién renovados hacia el valle de San Salvador, el lago de Ilopango y el volcán de San Vicente.', services: ['miradores', 'senderismo', 'restaurantes'], rating: 4.6, featured: true, verified: true, parking: true },
  { name: 'Cerro Verde', dept: 'SO', muni: 'Sonsonate Norte', category: 'Miradores', tags: ['mirador', 'senderismo', 'familia'], lat: 13.8394, lng: -89.6244, address: 'Parque Nacional Los Volcanes, Sonsonate', description: 'Mirador natural entre los volcanes de Izalco y Santa Ana, con senderos cortos aptos para toda la familia, flora exuberante y vista panorámica al Lago de Coatepeque.', services: ['senderos interpretativos', 'miradores', 'cafeteria'], rating: 4.5, parking: true },
  { name: 'Cerro El Pital', dept: 'CH', muni: 'Chalatenango Norte', category: 'Miradores', tags: ['senderismo', 'mirador', 'aventura', 'camping'], lat: 14.3894, lng: -89.1225, address: 'San Ignacio, Chalatenango', description: 'El punto más alto de El Salvador a 2,730 metros sobre el nivel del mar, en la frontera con Honduras, con clima frío y bosques de coníferas.', services: ['senderismo', 'camping', 'guias', 'cabañas'], rating: 4.7, featured: true, verified: true },
  { name: 'Cerro de las Pavas', dept: 'CH', muni: 'Chalatenango Sur', category: 'Miradores', tags: ['mirador', 'lago', 'atardecer'], lat: 13.95, lng: -89.05, address: 'Suchitoto, Cuscatlán', description: 'Mirador panorámico ubicado en Cojutepeque (Cuscatlán/Chalatenango límite) que alberga el santuario de la Virgen de Fátima y ofrece vistas del Lago de Suchitlán.', services: ['miradores', 'santuario'], rating: 4.5 },
  { name: 'Turicentro Los Chorros', dept: 'LL', muni: 'La Libertad Norte', category: 'Balnearios y Aguas Termales', tags: ['turicentro', 'familia'], lat: 13.7469, lng: -89.4083, address: 'Nuevo Cuscatlán, La Libertad', description: 'Turicentro administrado por ISTU con piscinas de manantial rodeadas de exuberante vegetación y cascadas artificiales.', services: ['piscinas', 'ranchos'], rating: 4.1, parking: true, petFriendly: true },
  { name: 'Turicentro Atecozol', dept: 'SO', muni: 'Sonsonate Centro', category: 'Balnearios y Aguas Termales', tags: ['turicentro', 'familia'], lat: 13.5878, lng: -89.8317, address: 'Izalco, Sonsonate', description: 'Turicentro histórico conocido por sus monumentos indígenas integrados a la naturaleza y piscinas alimentadas por manantiales del volcán de Izalco.', services: ['piscinas', 'ranchos'], rating: 4.2, parking: true },
  { name: 'Turicentro Apulo', dept: 'CU', muni: 'Cuscatlán Sur', category: 'Balnearios y Aguas Termales', tags: ['turicentro', 'lago'], lat: 13.68, lng: -89.05, address: 'Ilopango, San Salvador / Cuscatlán', description: 'Turicentro sobre las orillas del Lago de Ilopango, con muelles renovados, piscinas y renta de lanchas para paseos acuáticos.', services: ['piscinas', 'lanchas', 'restaurantes'], rating: 4.0, parking: true },
  { name: 'Turicentro Amapulapa', dept: 'SV', muni: 'San Vicente Sur', category: 'Balnearios y Aguas Termales', tags: ['turicentro', 'familia'], lat: 13.6231, lng: -88.7750, address: 'San Vicente', description: 'Parque acuático rodeado de ceibas milenarias y alimentado por afloramientos de agua de origen volcánico.', services: ['piscinas', 'canchas'], rating: 4.1, parking: true },
  { name: 'Termales de Santa Teresa', dept: 'AH', muni: 'Ahuachapán Centro', category: 'Balnearios y Aguas Termales', tags: ['aguas-termales', 'familia', 'romantico'], lat: 13.92, lng: -89.83, address: 'Ahuachapán', description: 'Balneario de aguas termales de origen volcánico con múltiples piscinas de distintas temperaturas, spa y baños de barro.', services: ['piscinas termales', 'spa', 'hospedaje'], rating: 4.5, featured: true, verified: true, parking: true },
  { name: 'Termales de Alicante', dept: 'AH', muni: 'Ahuachapán Centro', category: 'Balnearios y Aguas Termales', tags: ['aguas-termales', 'naturaleza'], lat: 13.93, lng: -89.81, address: 'Ahuachapán', description: 'Piscinas de aguas termales naturales enclavadas en un entorno de montaña y cafetales.', services: ['piscinas termales', 'restaurante'], rating: 4.3, parking: true },

  // --- MERCADOS, COMPRAS Y TRANSPORTES ---
  { name: 'Mercado Nacional de Artesanías', dept: 'SS', muni: 'San Salvador Centro', category: 'Mercados', tags: ['artesanias', 'compras'], lat: 13.702, lng: -89.226, address: 'San Salvador', description: 'Espacio concentrado de artesanías provenientes de distintas regiones del país, ideal para compra de recuerdos y textiles.', services: ['compras'], rating: 4.2, parking: true },
  { name: 'Mercado Ex Cuartel', dept: 'SS', muni: 'San Salvador Centro', category: 'Mercados', tags: ['artesanias', 'compras', 'historia'], lat: 13.6975, lng: -89.1928, address: 'Centro Histórico, San Salvador', description: 'Antiguo cuartel militar convertido en un dinámico mercado, especialmente famoso por su sección de artesanías, calzado y ropa típica.', services: ['compras'], rating: 4.0 },
  { name: 'Mercado Central de San Salvador', dept: 'SS', muni: 'San Salvador Centro', category: 'Mercados', tags: ['gastronomia', 'compras'], lat: 13.6994, lng: -89.1919, address: 'Centro Histórico, San Salvador', description: 'El mercado más grande de la capital, un vibrante laberinto de comercio donde se encuentra desde fruta fresca hasta comedores populares.', services: ['gastronomia', 'compras'], rating: 4.0 },
  { name: 'Metrocentro San Salvador', dept: 'SS', muni: 'San Salvador Oeste', category: 'Centros Comerciales', tags: ['compras', 'gastronomia'], lat: 13.6989, lng: -89.2306, address: 'San Salvador', description: 'Uno de los centros comerciales más antiguos y grandes de Centroamérica, con un alto tránsito peatonal y cientos de comercios.', services: ['tiendas', 'cines', 'restaurantes'], rating: 4.3, parking: true, wifi: true },
  { name: 'Multiplaza San Salvador', dept: 'LL', muni: 'La Libertad Centro', category: 'Centros Comerciales', tags: ['compras', 'gastronomia', 'vida-nocturna'], lat: 13.6772, lng: -89.2544, address: 'Antiguo Cuscatlán, La Libertad', description: 'Centro comercial de diseño vanguardista con boutiques internacionales, restaurantes de alto nivel y el área de bares y clubes "Las Terrazas".', services: ['tiendas', 'cines', 'restaurantes', 'bares'], rating: 4.5, parking: true, wifi: true },
  { name: 'Aeropuerto Internacional de El Salvador (SAL)', dept: 'LP', muni: 'La Paz Este', category: 'Aeropuertos', tags: ['transporte'], lat: 13.4409, lng: -89.0556, address: 'Comalapa, La Paz', description: 'El "Hub" de las Américas, un aeropuerto moderno y expandido en San Luis Talpa (La Paz), punto de conexión internacional.', services: ['vuelos', 'renta de autos', 'transporte VIP'], rating: 4.4, verified: true, parking: true, wifi: true },
  { name: 'Puerto de La Unión', dept: 'UN', muni: 'La Unión Sur', category: 'Puertos', tags: ['transporte'], lat: 13.3372, lng: -87.8253, address: 'La Unión', description: 'Moderno puerto de gran calado ubicado en el Golfo de Fonseca, concebido para el comercio regional marítimo.', services: ['carga maritima'], rating: 3.9 },
  { name: 'Malecón de Puerto La Libertad', dept: 'LL', muni: 'La Libertad Centro', category: 'Malecones', tags: ['gastronomia', 'atardecer', 'pesca'], lat: 13.4867, lng: -89.3225, address: 'Puerto de La Libertad, La Libertad', description: 'Muelle histórico rodeado por el complejo turístico Mercado del Mar y Plaza Gastronómica, con excelente oferta de mariscos frescos.', services: ['restaurantes', 'muelle', 'compras de mariscos'], rating: 4.5, verified: true, parking: true },

  // --- RUTAS TURÍSTICAS ---
  { name: 'Ruta de Las Flores', dept: 'SO', muni: 'Sonsonate Este', category: 'Rutas Turísticas', tags: ['cafe-de-altura', 'artesanias', 'gastronomia', 'mural'], lat: 13.845, lng: -89.76, address: 'Sonsonate / Ahuachapán', description: 'El corredor turístico más pintoresco de El Salvador. 32 kilómetros que conectan los pueblos de Nahuizalco, Salcoatitán, Juayúa, Apaneca y Ataco a través de la sierra Apaneca-Ilamatepec.', services: ['tours guiados', 'gastronomia'], rating: 4.8, featured: true, verified: true },
  { name: 'Ruta Arqueológica', dept: 'LL', muni: 'La Libertad Norte', category: 'Rutas Turísticas', tags: ['maya', 'historia', 'patrimonio'], lat: 13.82, lng: -89.38, address: 'La Libertad / Santa Ana', description: 'Circuito que engloba los vestigios de las culturas prehispánicas del occidente: Joya de Cerén, San Andrés, Tazumal y Casa Blanca.', services: ['tours guiados', 'museos'], rating: 4.6, verified: true },
  { name: 'Ruta de Paz', dept: 'MO', muni: 'Morazán Norte', category: 'Rutas Turísticas', tags: ['guerra-civil', 'historia', 'museo'], lat: 13.95, lng: -88.15, address: 'Morazán', description: 'Ruta enclavada en las montañas del norte de Morazán que educa sobre la Guerra Civil Salvadoreña (1980-1992) visitando ex-campamentos guerrilleros y museos.', services: ['tours guiados', 'museos'], rating: 4.5, verified: true }
];

const EVENT_TEMPLATES: { title: string; placeName?: string; monthsAhead: number; day: number; description: string }[] = [
  { title: 'Feria de las Flores y las Palmas', placeName: 'Panchimalco', monthsAhead: 2, day: 8, description: 'Celebración anual de tradición indígena con procesiones adornadas de flores de flor de izote.' },
  { title: 'Festival Gastronómico de Fin de Semana', placeName: 'Juayúa', monthsAhead: 1, day: 15, description: 'Feria de comida típica e internacional en el parque central de Juayúa.' },
  { title: 'Feria de Agosto (Fiestas Patronales de San Salvador)', placeName: 'Monumento al Divino Salvador del Mundo', monthsAhead: 1, day: 5, description: 'Celebración patronal de la capital en honor al Divino Salvador del Mundo.' },
  { title: 'Festival del Añil', placeName: 'Sitio Arqueológico Casa Blanca', monthsAhead: 3, day: 20, description: 'Muestra de la técnica tradicional de teñido con añil salvadoreño.' },
  { title: 'Recorrido Nocturno de Suchitoto', placeName: 'Suchitoto', monthsAhead: 2, day: 12, description: 'Recorrido cultural nocturno por galerías y calles empedradas del centro histórico.' },
  { title: 'Feria de Café de Altura', placeName: 'Apaneca', monthsAhead: 4, day: 18, description: 'Cata y venta de café de altura producido en fincas de la Ruta de Las Flores.' },
  { title: 'Amanecer en el Cráter (Ascenso guiado)', placeName: 'Volcán de Santa Ana (Ilamatepec)', monthsAhead: 1, day: 25, description: 'Ascenso guiado nocturno para observar el amanecer desde la cima del volcán.' },
  { title: 'Feria Artesanal de Nahuizalco', placeName: 'Nahuizalco', monthsAhead: 2, day: 3, description: 'Exhibición y venta de artesanías tradicionales en mimbre y tule.' },
  { title: 'Conmemoración Histórica de El Mozote', placeName: 'Sitio Histórico El Mozote', monthsAhead: 5, day: 11, description: 'Acto conmemorativo anual en memoria de las víctimas del conflicto armado.' },
  { title: 'Regata de Kayak en Coatepeque', placeName: 'Lago de Coatepeque', monthsAhead: 3, day: 9, description: 'Competencia recreativa de kayak abierta al público en el lago.' },
  { title: 'Torneo de Surf Surf City', placeName: 'Playa El Tunco', monthsAhead: 2, day: 22, description: 'Competencia de surf con participación de atletas nacionales e internacionales.' },
  { title: 'Festival de Aves Migratorias', placeName: 'Bahía de Jiquilisco', monthsAhead: 4, day: 6, description: 'Jornada de avistamiento de aves migratorias guiada por especialistas locales.' },
  { title: 'Noche de Museos', placeName: 'Museo Nacional de Antropología (MUNA)', monthsAhead: 1, day: 29, description: 'Apertura extendida nocturna con actividades culturales gratuitas.' },
  { title: 'Feria del Bálsamo y las Flores', placeName: 'Volcán y Laguna de Alegría (Tecapa)', monthsAhead: 5, day: 14, description: 'Celebración en honor a la producción tradicional de bálsamo y flores del municipio de Alegría.' },
  { title: 'Semana Santa en el Centro Histórico', placeName: 'Catedral Metropolitana de San Salvador', monthsAhead: 6, day: 1, description: 'Procesiones y alfombras de aserrín en las calles del centro histórico capitalino.' },
];

async function main() {
  await prisma.$transaction([
    prisma.department.createMany({
      data: DEPARTMENTS.map((d) => ({
        name: d.name,
        slug: slug(d.name),
        code: d.code,
        description: `Departamento de ${d.name}, El Salvador.`,
        latitude: d.lat,
        longitude: d.lng,
      })),
      skipDuplicates: true,
    }),
    prisma.category.createMany({
      data: CATEGORIES.map((c) => ({
        name: c.name,
        slug: slug(c.name),
        icon: c.icon,
        color: c.color,
        description: `Lugares clasificados como ${c.name}.`,
      })),
      skipDuplicates: true,
    }),
    prisma.tag.createMany({
      data: TAGS.map((t) => ({ name: t, slug: slug(t) })),
      skipDuplicates: true,
    }),
    prisma.language.createMany({ data: LANGUAGES, skipDuplicates: true }),
    prisma.layer.createMany({
      data: LAYERS.map((name) => ({
        name,
        slug: slug(name),
        type: 'geojson',
        description: `Capa territorial de ${name} para visualizacion en el mapa.`,
        source: 'DataPulse demo layer',
        config: { clusterable: true, leaflet: true, minZoom: 6, maxZoom: 18 },
        style: { visible: true, opacity: 0.85 },
      })),
      skipDuplicates: true,
    }),
  ]);

  const departments = await prisma.department.findMany();
  const deptByName = new Map(departments.map((d) => [d.name, d]));
  const deptCodeToRecord = new Map(DEPARTMENTS.map((d) => [d.code, deptByName.get(d.name)!]));

  await prisma.municipality.createMany({
    data: MUNICIPALITIES.map((m) => ({
      name: m.name,
      slug: slug(m.name),
      departmentId: deptCodeToRecord.get(m.dept)!.id,
      description: `Municipio de ${m.name}, El Salvador.`,
      latitude: m.lat,
      longitude: m.lng,
    })),
    skipDuplicates: true,
  });

  const municipalities = await prisma.municipality.findMany();
  const muniByName = new Map(municipalities.map((m) => [m.name, m]));

  const categories = await prisma.category.findMany();
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

  const tags = await prisma.tag.findMany();
  const tagBySlug = new Map(tags.map((t) => [t.slug, t]));

  const languages = await prisma.language.findMany();

  const placeRng = seededRandom('datapulse-places');

  await prisma.touristPlace.createMany({
    data: PLACES.map((p) => {
      const dept = deptCodeToRecord.get(p.dept)!;
      const muni = muniByName.get(p.muni)!;
      const cat = categoryBySlug.get(slug(p.category))!;
      return {
        name: p.name,
        slug: slug(p.name),
        description: p.description,
        history: p.history ?? null,
        categoryId: cat.id,
        departmentId: dept.id,
        municipalityId: muni.id,
        latitude: p.lat,
        longitude: p.lng,
        address: p.address,
        openingHours: { lunes_domingo: '08:00-17:00', nota: 'Horario referencial, puede variar por temporada' },
        price: p.price ?? (rangeFrom(placeRng, 0, 1) > 0.5 ? 'Gratis' : 'Entrada con costo variable'),
        website: null,
        email: null,
        phone: null,
        socialMedia: null,
        rating: p.rating,
        services: p.services,
        gallery: [],
        accessibility: { sillaDeRuedas: !!p.parking, senaletica: true },
        parking: !!p.parking,
        wifi: !!p.wifi,
        petFriendly: !!p.petFriendly,
        verified: !!p.verified,
        featured: !!p.featured,
        status: PlaceStatus.PUBLISHED,
        geojson: { type: 'Point', coordinates: [p.lng, p.lat] },
      };
    }),
    skipDuplicates: true,
  });

  const places = await prisma.touristPlace.findMany();
  const placeByName = new Map(places.map((pl) => [pl.name, pl]));

  const placeTagRows: { touristPlaceId: string; tagId: string }[] = [];
  const placeLangRows: { touristPlaceId: string; languageId: string }[] = [];
  const mediaRows: { touristPlaceId: string; url: string; type: string; altText: string }[] = [];

  const spanish = languages.find((l) => l.code === 'es')!;
  const english = languages.find((l) => l.code === 'en')!;

  for (const p of PLACES) {
    const place = placeByName.get(p.name);
    if (!place) continue;
    for (const t of p.tags) {
      const tag = tagBySlug.get(slug(t));
      if (tag) placeTagRows.push({ touristPlaceId: place.id, tagId: tag.id });
    }
    placeLangRows.push({ touristPlaceId: place.id, languageId: spanish.id });
    if (p.featured || p.verified) {
      placeLangRows.push({ touristPlaceId: place.id, languageId: english.id });
    }
    const photoCount = p.featured ? 3 : 2;
    for (let i = 0; i < photoCount; i++) {
      mediaRows.push({
        touristPlaceId: place.id,
        url: `https://source.unsplash.com/collection/datapulse-demo/${slug(p.name)}-${i}`,
        type: 'image',
        altText: `${p.name} - fotografia ${i + 1} (imagen de referencia, contenido demostrativo)`,
      });
    }
  }

  await prisma.$transaction([
    prisma.placeTag.createMany({ data: placeTagRows, skipDuplicates: true }),
    prisma.placeLanguage.createMany({ data: placeLangRows, skipDuplicates: true }),
    prisma.media.createMany({ data: mediaRows, skipDuplicates: true }),
  ]);

  const now = new Date();
  const eventRows = EVENT_TEMPLATES.map((e) => {
    const startsAt = new Date(now);
    startsAt.setMonth(startsAt.getMonth() + e.monthsAhead);
    startsAt.setDate(e.day);
    startsAt.setHours(10, 0, 0, 0);
    const endsAt = new Date(startsAt);
    endsAt.setHours(endsAt.getHours() + 6);
    const place = e.placeName ? placeByName.get(e.placeName) : undefined;
    return {
      title: e.title,
      slug: slug(e.title) + '-' + startsAt.getFullYear(),
      description: e.description,
      startsAt,
      endsAt,
      status: EventStatus.SCHEDULED,
      latitude: place ? place.latitude : null,
      longitude: place ? place.longitude : null,
      touristPlaceId: place ? place.id : null,
      metadata: { demo: true, note: 'Evento de demostracion para la plataforma DataPulse' },
    };
  });

  for (const dept of DEPARTMENTS) {
    for (let i = 0; i < 4; i++) {
      const startsAt = new Date(now);
      startsAt.setMonth(startsAt.getMonth() + 1 + i);
      startsAt.setDate(10 + i * 5);
      startsAt.setHours(16, 0, 0, 0);
      const title = `Jornada Cultural de ${dept.name} #${i + 1}`;
      eventRows.push({
        title,
        slug: slug(title) + '-' + startsAt.getTime(),
        description: `Actividad cultural comunitaria de demostracion en el departamento de ${dept.name}.`,
        startsAt,
        endsAt: null,
        status: EventStatus.SCHEDULED,
        latitude: dept.lat,
        longitude: dept.lng,
        touristPlaceId: null,
        metadata: { demo: true, note: 'Evento generado para demostracion de dashboards, no representa un evento oficial confirmado' },
      });
    }
  }

  await prisma.event.createMany({ data: eventRows, skipDuplicates: true });

  const INDICATOR_TYPES = [
    { name: 'Visitantes turisticos mensuales', unit: 'personas', min: 500, max: 25000 },
    { name: 'Ingresos por turismo', unit: 'USD', min: 20000, max: 900000 },
    { name: 'PIB departamental estimado', unit: 'USD millones', min: 50, max: 3000 },
    { name: 'Indice de seguridad ciudadana', unit: 'indice 0-100', min: 40, max: 98 },
    { name: 'Tasa de homicidios', unit: 'por 100,000 habitantes', min: 0, max: 15 },
    { name: 'Tasa de alfabetizacion', unit: 'porcentaje', min: 80, max: 99 },
    { name: 'Cobertura de salud primaria', unit: 'porcentaje', min: 55, max: 95 },
    { name: 'Cobertura de internet', unit: 'porcentaje', min: 40, max: 90 },
    { name: 'Indice de movilidad urbana', unit: 'indice 0-100', min: 30, max: 90 },
    { name: 'Temperatura promedio anual', unit: 'C', min: 22, max: 32 },
    { name: 'Poblacion estimada', unit: 'habitantes', min: 60000, max: 1800000 },
    { name: 'Inversion publica en infraestructura', unit: 'USD millones', min: 1, max: 120 },
  ];

  const indicatorRng = seededRandom('datapulse-indicators');
  const indicatorRows: any[] = [];
  const period = '2026';
  for (const dept of DEPARTMENTS) {
    const deptRecord = deptCodeToRecord.get(dept.code)!;
    for (const type of INDICATOR_TYPES) {
      const value = rangeFrom(indicatorRng, type.min, type.max);
      const name = `${type.name} - ${dept.name}`;
      indicatorRows.push({
        name,
        slug: slug(name) + '-' + period,
        description: `Valor de demostracion para ${type.name.toLowerCase()} en el departamento de ${dept.name}. No representa una cifra oficial verificada.`,
        value: Number(value.toFixed(2)),
        unit: type.unit,
        period,
        departmentId: deptRecord.id,
        municipalityId: null,
        metadata: { demo: true, source: 'DataPulse demo dataset' },
      });
    }
  }
  
  const sampleMunis = ['La Libertad Costa', 'Sonsonate Este', 'Santa Ana Oeste', 'San Salvador Centro', 'Cuscatlán Norte', 'Ahuachapán Centro'];
  for (const muniName of sampleMunis) {
    const muni = muniByName.get(muniName)!;
    for (const type of INDICATOR_TYPES.slice(0, 6)) {
      const value = rangeFrom(indicatorRng, type.min, type.max);
      const name = `${type.name} - ${muniName}`;
      indicatorRows.push({
        name,
        slug: slug(name) + '-' + period,
        description: `Valor de demostracion para ${type.name.toLowerCase()} en ${muniName}. No representa una cifra oficial verificada.`,
        value: Number(value.toFixed(2)),
        unit: type.unit,
        period,
        departmentId: muni.departmentId,
        municipalityId: muni.id,
        metadata: { demo: true, source: 'DataPulse demo dataset' },
      });
    }
  }

  await prisma.indicator.createMany({ data: indicatorRows, skipDuplicates: true });

  const STAT_KEYS = [
    'busquedas_mensuales', 'clics_en_mapa', 'lugares_favoritos', 'descargas_de_reportes',
    'usuarios_activos', 'sesiones_promedio_minutos', 'filtros_aplicados', 'eventos_asistidos_estimado',
    'reseñas_publicadas', 'exportaciones_generadas',
  ];
  const statRng = seededRandom('datapulse-stats');
  const statRows: any[] = [];
  for (const dept of DEPARTMENTS) {
    const deptRecord = deptCodeToRecord.get(dept.code)!;
    for (const key of STAT_KEYS) {
      statRows.push({
        key: `${key}_${slug(dept.name)}`,
        value: Number(rangeFrom(statRng, 10, 50000).toFixed(2)),
        unit: key.includes('minutos') ? 'minutos' : 'conteo',
        departmentId: deptRecord.id,
        municipalityId: null,
        metadata: { demo: true, note: 'Estadistica de uso simulada para demostracion de dashboards' },
      });
    }
  }
  for (const muniName of sampleMunis) {
    const muni = muniByName.get(muniName)!;
    for (const key of STAT_KEYS.slice(0, 5)) {
      statRows.push({
        key: `${key}_${slug(muniName)}`,
        value: Number(rangeFrom(statRng, 10, 20000).toFixed(2)),
        unit: 'conteo',
        departmentId: muni.departmentId,
        municipalityId: muni.id,
        metadata: { demo: true, note: 'Estadistica de uso simulada para demostracion de dashboards' },
      });
    }
  }

  await prisma.statistic.createMany({ data: statRows, skipDuplicates: true });

  const DATASET_DEFS = [
    { name: 'Directorio Nacional de Lugares Turisticos', format: DatasetFormat.GEOJSON, source: 'DataPulse' },
    { name: 'Indicadores Departamentales de Turismo', format: DatasetFormat.CSV, source: 'DataPulse' },
    { name: 'Calendario Nacional de Eventos', format: DatasetFormat.JSON, source: 'DataPulse' },
    { name: 'Capas Geoespaciales Base', format: DatasetFormat.GEOJSON, source: 'DataPulse' },
    { name: 'Estadisticas de Uso de la Plataforma', format: DatasetFormat.EXCEL, source: 'DataPulse' },
    { name: 'Indicadores de Seguridad por Departamento', format: DatasetFormat.CSV, source: 'DataPulse' },
    { name: 'Indicadores Economicos Territoriales', format: DatasetFormat.CSV, source: 'DataPulse' },
    { name: 'Registro de Sitios Arqueologicos', format: DatasetFormat.JSON, source: 'DataPulse' },
    { name: 'Registro de Areas Protegidas', format: DatasetFormat.GEOJSON, source: 'DataPulse' },
    { name: 'Directorio de Rutas Turisticas', format: DatasetFormat.JSON, source: 'DataPulse' },
  ];
  const datasetRows = DATASET_DEFS.map((d, i) => ({
    name: d.name,
    slug: slug(d.name),
    description: `Conjunto de datos de demostracion: ${d.name}. Generado para poblar la plataforma DataPulse.`,
    format: d.format,
    source: d.source,
    schema: { fields: ['id', 'nombre', 'departamento', 'valor'], demo: true },
    metadata: { demo: true, refreshFrequency: 'mensual', datasetIndex: i },
    public: true,
  }));
  await prisma.dataset.createMany({ data: datasetRows, skipDuplicates: true });

  const datasets = await prisma.dataset.findMany();

  const reportRows = datasets.flatMap((ds, idx) => {
    return [0, 1].map((n) => {
      const title = `Reporte ${ds.name} #${n + 1}`;
      return {
        name: title,
        slug: slug(title),
        description: `Reporte generado a partir del dataset "${ds.name}" con fines de demostracion.`,
        filters: { periodo: '2026', departamento: 'todos' },
        metadata: { demo: true },
        summary: { totalRegistros: Math.floor(50 + idx * 7), generadoEn: '2026' },
        datasetId: ds.id,
      };
    });
  });
  await prisma.report.createMany({ data: reportRows, skipDuplicates: true });

  const reports = await prisma.report.findMany();
  const exportRows = reports.map((r, idx) => ({
    format: idx % 2 === 0 ? ExportFormat.PDF : ExportFormat.CSV,
    url: `https://datapulse.gob.sv/exports/${r.slug}.${idx % 2 === 0 ? 'pdf' : 'csv'}`,
    metadata: { demo: true, generatedFor: r.name },
    reportId: r.id,
  }));
  await prisma.export.createMany({ data: exportRows, skipDuplicates: true });

  console.log(`Seed completo: ${departments.length} departamentos, ${municipalities.length} municipios, ${categories.length} categorias, ${tags.length} tags, ${languages.length} idiomas, ${LAYERS.length} capas, ${places.length} lugares turisticos reales, ${eventRows.length} eventos, ${indicatorRows.length} indicadores, ${statRows.length} estadisticas, ${datasetRows.length} datasets, ${reportRows.length} reportes, ${exportRows.length} exportaciones.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });