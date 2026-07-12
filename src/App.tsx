import { lazy, Suspense, useMemo, useState } from 'react';
import { MessageSquareText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AssistantPanel } from './components/ai/AssistantPanel';
import { FilterPanel } from './components/filters/FilterPanel';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { type NavId, navItems } from './components/layout/navigation';
import { InteractiveMap } from './components/map/InteractiveMap';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Badge } from './components/ui/Badge';
import { api } from './lib/api';
import { PRODUCT_NAME } from './lib/brand';
import { fallbackDashboard, fallbackDatasets, fallbackHeatmap, fallbackInsights, fallbackMapConfig, fallbackReports } from './lib/fallbackData';
import type { SearchFilters } from './lib/types';
import { useAsyncData } from './hooks/useAsyncData';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const DatasetsPage = lazy(() => import('./pages/DatasetsPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

const initialFilters: SearchFilters = {
  searchText: '',
  categories: [],
  departmentSlug: '',
  municipalitySlug: '',
  district: '',
  tags: [],
  dateFrom: '',
  dateTo: '',
};

function LoadingPanel() {
  const { t } = useTranslation();
  return (
    <Card title={t('app.loading')} eyebrow={PRODUCT_NAME}>
      <div className="h-24 animate-pulse rounded-lg bg-white/5" />
    </Card>
  );
}

export default function App() {
  const { t } = useTranslation();
  const [active, setActive] = useState<NavId>('dashboard');
  const [navOpen, setNavOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  const dashboard = useAsyncData(api.dashboard);
  const mapConfig = useAsyncData(api.mapConfig);
  const heatmap = useAsyncData(api.heatmap);
  const insights = useAsyncData(api.insights);
  const datasets = useAsyncData(api.datasets);
  const reports = useAsyncData(api.reports);

  const activeLabelKey = useMemo(() => navItems.find((item) => item.id === active)?.labelKey ?? 'nav.dashboard', [active]);
  const title = t(activeLabelKey);
  const dashboardData = dashboard.data ?? fallbackDashboard;
  const insightData = insights.data ?? fallbackInsights;
  const datasetData = datasets.data ?? fallbackDatasets;
  const reportData = reports.data ?? fallbackReports;
  const apiFallbacks = [dashboard, mapConfig, heatmap, insights, datasets, reports].filter((resource) => resource.error).length;

  function renderContent() {
    if (active === 'dashboard') return <DashboardPage dashboard={dashboardData} insights={insightData} />;
    if (active === 'map') {
      return (
        <div className="space-y-4">
          <Card title={t('app.map_controls_title')} eyebrow={t('app.map_controls_eyebrow')}>
            <p className="text-sm leading-6 text-steel-300">{t('app.map_controls_detail')}</p>
          </Card>
        </div>
      );
    }
    if (active === 'analytics') return <AnalyticsPage dashboard={dashboardData} insights={insightData} />;
    if (active === 'datasets') return <DatasetsPage datasets={datasetData} />;
    if (active === 'reports' || active === 'downloads') return <ReportsPage reports={reportData} />;
    if (active === 'assistant') {
      return (
        <Card title={t('app.assistant_card_title')} eyebrow={t('app.assistant_card_eyebrow')}>
          <p className="text-sm leading-6 text-steel-300">{t('app.assistant_card_detail')}</p>
          <Button className="mt-4 xl:hidden" icon={<MessageSquareText size={16} />} onClick={() => setAssistantOpen(true)} variant="primary">
            {t('app.open_assistant')}
          </Button>
        </Card>
      );
    }
    if (active === 'about') return <AboutPage />;
    return <SettingsPage />;
  }

  return (
    <div className="min-h-screen bg-ink-950">
      <div className="flex">
        <Sidebar active={active} onChange={setActive} open={navOpen} onClose={() => setNavOpen(false)} />
        <div className="min-w-0 flex-1">
          <Topbar title={title} onMenu={() => setNavOpen(true)} />
          <main className="grid gap-4 p-4 lg:p-6 xl:grid-cols-[minmax(0,1fr)_minmax(420px,34vw)]">
            <div className="min-w-0 space-y-4">
              {apiFallbacks > 0 && (
                <div className="surface flex flex-wrap items-center justify-between gap-3 p-3" role="status">
                  <p className="text-sm text-steel-300">{t('app.fallback_banner')}</p>
                  <Badge>{apiFallbacks} {t('app.fallback_badge')}</Badge>
                </div>
              )}
              <FilterPanel filters={filters} onChange={setFilters} />
              <Suspense fallback={<LoadingPanel />}>{renderContent()}</Suspense>
            </div>
            <div className="order-first space-y-4 xl:sticky xl:top-[88px] xl:order-none xl:self-start">
              <InteractiveMap
                config={mapConfig.data ?? fallbackMapConfig}
                heatmap={heatmap.data ?? fallbackHeatmap}
                filters={filters}
                expanded={active === 'map'}
                loading={mapConfig.loading || heatmap.loading}
              />
              <AssistantPanel docked open onClose={() => setAssistantOpen(false)} />
            </div>
          </main>
        </div>
      </div>
      <AssistantPanel open={assistantOpen} onClose={() => setAssistantOpen((current) => !current)} />
    </div>
  );
}
