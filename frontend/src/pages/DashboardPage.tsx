import { Building2, Database, Globe2, Layers, MapPinned, Star, Tags, CalendarDays } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { DashboardOverview, InsightResponse } from '../lib/types';
import { TerritorialCharts } from '../components/charts/TerritorialCharts';
import { Card } from '../components/ui/Card';
import { MetricCard } from '../components/ui/MetricCard';

interface DashboardPageProps {
  dashboard: DashboardOverview;
  insights: InsightResponse;
}

export default function DashboardPage({ dashboard, insights }: DashboardPageProps) {
  const { t } = useTranslation();
  const cards = dashboard.cards ?? {};
  const departments = dashboard.charts?.topDepartments ?? [];
  const categories = dashboard.charts?.topCategories ?? [];

  return (
    <div className="space-y-4">
      <section className="grid grid-cols-dashboard gap-4">
        <MetricCard label={t('dashboard.places')} value={cards.totalPlaces ?? cards.tourismPlaces ?? 0} detail={t('dashboard.places_detail')} icon={<MapPinned size={19} />} />
        <MetricCard label={t('dashboard.departments')} value={cards.totalDepartments ?? 14} detail={t('dashboard.departments_detail')} icon={<Globe2 size={19} />} />
        <MetricCard label={t('dashboard.municipalities')} value={cards.totalMunicipalities ?? 44} detail={t('dashboard.municipalities_detail')} icon={<Building2 size={19} />} />
        <MetricCard label={t('dashboard.categories')} value={cards.totalCategories ?? cards.categoryCoverage ?? 0} detail={t('dashboard.categories_detail')} icon={<Tags size={19} />} />
        <MetricCard label={t('dashboard.map_layers')} value={cards.enabledLayers ?? cards.activeLayers ?? 0} detail={t('dashboard.map_layers_detail')} icon={<Layers size={19} />} />
        <MetricCard label={t('dashboard.featured')} value={cards.featuredPlaces ?? 0} detail={t('dashboard.featured_detail')} icon={<Star size={19} />} />
        <MetricCard label={t('dashboard.datasets')} value={dashboard.recentDatasets?.length ?? 2} detail={t('dashboard.datasets_detail')} icon={<Database size={19} />} />
        <MetricCard label={t('dashboard.events')} value={cards.upcomingEvents ?? 0} detail={t('dashboard.events_detail')} icon={<CalendarDays size={19} />} />
      </section>

      <TerritorialCharts departments={departments} categories={categories} />

      <Card title={t('dashboard.signals_title')} eyebrow={t('dashboard.signals_eyebrow')}>
        {insights.insights.length ? (
          <div className="grid gap-3 md:grid-cols-3">
            {insights.insights.slice(0, 3).map((insight) => (
            <article className="surface-muted p-4" key={insight.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-pulse-amber">{insight.type}</p>
              <h3 className="mt-2 font-semibold text-white">{insight.title}</h3>
              <p className="mt-2 text-sm leading-6 text-steel-300">{insight.detail}</p>
            </article>
            ))}
          </div>
        ) : (
          <div className="surface-muted p-4 text-sm text-steel-300">{t('common.no_data_current_filters')}</div>
        )}
      </Card>
    </div>
  );
}
