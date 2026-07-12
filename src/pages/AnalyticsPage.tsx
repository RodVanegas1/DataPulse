import { useTranslation } from 'react-i18next';
import type { DashboardOverview, InsightResponse } from '../lib/types';
import { TerritorialCharts } from '../components/charts/TerritorialCharts';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

interface AnalyticsPageProps {
  dashboard: DashboardOverview;
  insights: InsightResponse;
}

export default function AnalyticsPage({ dashboard, insights }: AnalyticsPageProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <TerritorialCharts departments={dashboard.charts?.topDepartments ?? []} categories={dashboard.charts?.topCategories ?? []} />
      <Card title={t('analytics.trend_title')} eyebrow={t('analytics.trend_eyebrow')}>
        <div className="grid gap-3 md:grid-cols-2">
          {insights.insights.map((insight) => (
            <article className="surface-muted p-4" key={insight.title}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-white">{insight.title}</h3>
                <Badge>{insight.type}</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-steel-300">{insight.detail}</p>
            </article>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {(insights.futureSupport ?? []).map((item) => (
            <Badge key={item}>{item}</Badge>
          ))}
        </div>
      </Card>
    </div>
  );
}
