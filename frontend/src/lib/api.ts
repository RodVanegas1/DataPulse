import { fallbackDashboard, fallbackDatasets, fallbackHeatmap, fallbackInsights, fallbackMapConfig, fallbackReports } from './fallbackData';
import type { ApiEnvelope, DashboardOverview, Dataset, FeatureCollection, InsightResponse, MapConfig, Report } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'content-type': 'application/json', ...(options?.headers ?? {}) },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const payload = (await response.json()) as ApiEnvelope<T>;
  return payload.data;
}

export const api = {
  async dashboard(): Promise<DashboardOverview> {
    return request<DashboardOverview>('/dashboard/overview').catch(() => fallbackDashboard);
  },
  async mapConfig(): Promise<MapConfig> {
    return request<MapConfig>('/maps/config').catch(() => fallbackMapConfig);
  },
  async heatmap(): Promise<FeatureCollection> {
    return request<FeatureCollection>('/maps/heatmap').catch(() => fallbackHeatmap);
  },
  async insights(): Promise<InsightResponse> {
    return request<InsightResponse>('/insights').catch(() => fallbackInsights);
  },
  async datasets(): Promise<Dataset[]> {
    return request<Dataset[]>('/datasets').catch(() => fallbackDatasets);
  },
  async reports(): Promise<Report[]> {
  return request<{ dataset: Report[] } | Report[]>('/reports/tourism-places?format=json')
    .then((data) => (Array.isArray(data) ? data : fallbackReports))
    .catch(() => fallbackReports);
},

async tourism() {
  return request('/tourism?limit=500');
},
  async askAi(prompt: string, memory: Array<{ role: 'user' | 'assistant'; content: string }>) {
    return request<{ output: string; provider: string; metadata: Record<string, unknown> }>('/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, language: 'es', memory }),
    }).catch(() => ({
      provider: 'offline-fallback',
      output: 'El asistente no pudo conectar con el backend en este momento. La interfaz ya esta lista para consumir `/api/v1/ai/generate` cuando el servicio este activo.',
      metadata: {},
    }));
  },
  reportUrl(format: string) {
    return `${API_BASE_URL}/exports/tourism-places?format=${format}`;
  },
};
