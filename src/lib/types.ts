export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta: Record<string, unknown>;
  pagination: { page: number; limit: number; total: number; totalPages: number } | null;
}

export interface MetricCards {
  totalPlaces?: number;
  totalDepartments?: number;
  totalMunicipalities?: number;
  totalCategories?: number;
  enabledLayers?: number;
  upcomingEvents?: number;
  featuredPlaces?: number;
  tourismPlaces?: number;
  activeLayers?: number;
  categoryCoverage?: number;
}

export interface RankedItem {
  id?: string;
  name: string;
  slug: string;
  places?: number;
  value?: number;
}

export interface DashboardOverview {
  cards?: MetricCards;
  charts?: {
    topDepartments?: RankedItem[];
    topCategories?: RankedItem[];
  };
  mapSummary?: Record<string, number>;
  latestAnalytics?: string[];
  recentDatasets?: Dataset[];
  recentReports?: Report[];
}

export interface Dataset {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  format?: string;
  source?: string | null;
  createdAt?: string;
}

export interface Report {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt?: string;
}

export interface Layer {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string | null;
  enabled?: boolean;
  style?: Record<string, unknown> | null;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  latitude?: string | number | null;
  longitude?: string | number | null;
  municipalities?: Municipality[];
}

export interface Municipality {
  id: string;
  name: string;
  slug: string;
  latitude?: string | number | null;
  longitude?: string | number | null;
}

export interface MapConfig {
  center?: { latitude: number; longitude: number };
  zoom?: number;
  providers?: string[];
  capabilities?: string[];
  administrativeDivisions?: Department[];
  layers?: Layer[];
}

export interface HeatFeature {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: [number, number] };
  properties: {
    id?: string;
    name?: string;
    slug?: string;
    weight?: number;
    category?: { name: string; slug: string };
    department?: { name: string; slug: string };
    municipality?: { name: string; slug: string };
  };
}

export interface FeatureCollection {
  type: 'FeatureCollection';
  features: HeatFeature[];
  metadata?: Record<string, unknown>;
}

export interface Insight {
  type: string;
  title: string;
  detail: string;
}

export interface InsightResponse {
  generatedAt?: string;
  insights: Insight[];
  evidence?: Record<string, unknown>;
  futureSupport?: string[];
}

export interface SearchFilters {
  searchText: string;
  categories: string[];
  departmentSlug: string;
  municipalitySlug: string;
  district: string;
  tags: string[];
  dateFrom: string;
  dateTo: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
