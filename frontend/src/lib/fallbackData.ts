import type { DashboardOverview, Dataset, FeatureCollection, InsightResponse, MapConfig, Report } from './types';

export const fallbackDashboard: DashboardOverview = {
  cards: {
    totalPlaces: 128,
    totalDepartments: 14,
    totalMunicipalities: 44,
    totalCategories: 18,
    enabledLayers: 13,
    upcomingEvents: 9,
    featuredPlaces: 24,
  },
  charts: {
    topDepartments: [
      { name: 'La Libertad', slug: 'la-libertad', places: 28 },
      { name: 'San Salvador', slug: 'san-salvador', places: 24 },
      { name: 'Santa Ana', slug: 'santa-ana', places: 17 },
      { name: 'Sonsonate', slug: 'sonsonate', places: 13 },
    ],
    topCategories: [
      { name: 'Tourism', slug: 'tourism', places: 34 },
      { name: 'Culture', slug: 'culture', places: 21 },
      { name: 'Protected Areas', slug: 'protected-areas', places: 18 },
      { name: 'Volcanoes', slug: 'volcanoes', places: 12 },
    ],
  },
  latestAnalytics: [
    'Tourism clusters concentrate around coastal and volcanic corridors.',
    'Featured places show high readiness for public promotion.',
    'Environmental and transport overlays are prepared for future GIS enrichment.',
  ],
};

export const fallbackMapConfig: MapConfig = {
  center: { latitude: 13.7942, longitude: -88.8965 },
  zoom: 8,
  providers: ['OpenStreetMap', 'Leaflet', 'MapLibre-ready'],
  capabilities: ['geojson', 'heatmap', 'clusters', 'administrative-layers', 'satellite-ready', 'terrain-ready', '3d-ready'],
  layers: [
    { id: 'tourism', name: 'Tourism', slug: 'tourism', type: 'geojson', enabled: true },
    { id: 'culture', name: 'Culture', slug: 'culture', type: 'geojson', enabled: true },
    { id: 'environment', name: 'Environment', slug: 'environment', type: 'geojson', enabled: true },
  ],
  administrativeDivisions: [
    { id: 'ss', name: 'San Salvador', slug: 'san-salvador', latitude: 13.6929, longitude: -89.2182, municipalities: [] },
    { id: 'll', name: 'La Libertad', slug: 'la-libertad', latitude: 13.6818, longitude: -89.3606, municipalities: [] },
    { id: 'sa', name: 'Santa Ana', slug: 'santa-ana', latitude: 13.9942, longitude: -89.5597, municipalities: [] },
  ],
};

export const fallbackHeatmap: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-89.3813, 13.4949] },
      properties: { id: 'tunco', name: 'Playa El Tunco', slug: 'playa-el-tunco', weight: 5.7, category: { name: 'Beach', slug: 'beach' }, department: { name: 'La Libertad', slug: 'la-libertad' } },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-89.6308, 13.8533] },
      properties: { id: 'santa-ana-volcano', name: 'Volcan Santa Ana', slug: 'volcan-santa-ana', weight: 5.8, category: { name: 'Volcano', slug: 'volcano' }, department: { name: 'Santa Ana', slug: 'santa-ana' } },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-89.2182, 13.6929] },
      properties: { id: 'centro', name: 'Centro Historico', slug: 'centro-historico', weight: 4.4, category: { name: 'Culture', slug: 'culture' }, department: { name: 'San Salvador', slug: 'san-salvador' } },
    },
  ],
};

export const fallbackInsights: InsightResponse = {
  generatedAt: new Date().toISOString(),
  insights: [
    { type: 'regional-leader', title: 'Tourism corridor', detail: 'La Libertad and Santa Ana form a strong tourism and nature corridor.' },
    { type: 'investment-zones', title: 'Investment signal', detail: 'Featured clusters are ready for lodging, transport, and cultural commerce analysis.' },
    { type: 'environmental', title: 'Environmental readiness', detail: 'Protected area and terrain layers can be integrated without changing the map architecture.' },
  ],
  futureSupport: ['historical-series', 'satellite-imagery', '3d-terrain', 'forecasting'],
};

export const fallbackDatasets: Dataset[] = [
  { id: '1', name: 'Tourism Places', slug: 'tourism-places', format: 'GEOJSON', source: 'La Olla de Datos' },
  { id: '2', name: 'Administrative Divisions', slug: 'administrative-divisions', format: 'JSON', source: 'La Olla de Datos' },
];

export const fallbackReports: Report[] = [
  { id: '1', name: 'Tourism Places Report', slug: 'tourism-places' },
  { id: '2', name: 'Territorial Readiness Brief', slug: 'territorial-readiness' },
];
