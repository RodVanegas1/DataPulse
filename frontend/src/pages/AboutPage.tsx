import { useTranslation } from 'react-i18next';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PRODUCT_DESCRIPTION, PRODUCT_NAME } from '../lib/brand';

export default function AboutPage() {
  const { t } = useTranslation();

  const roadmapItems = [
    { key: 'roadmap_satellite' },
    { key: 'roadmap_scenes' },
    { key: 'roadmap_terrain' },
  ];

  return (
    <div className="space-y-4">
      <Card title={PRODUCT_NAME} eyebrow={t('about_page.eyebrow')}>
        <p className="max-w-3xl text-sm leading-7 text-steel-300">
          {PRODUCT_DESCRIPTION} {t('about_page.description_suffix')}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>{t('about_page.badge_api')}</Badge>
          <Badge>{t('about_page.badge_responsive')}</Badge>
          <Badge>{t('about_page.badge_pwa')}</Badge>
          <Badge>{t('about_page.badge_osm')}</Badge>
          <Badge>{t('about_page.badge_leaflet')}</Badge>
          <Badge>{t('about_page.badge_maplibre')}</Badge>
          <Badge>{t('about_page.badge_cesium')}</Badge>
        </div>
      </Card>
      <Card title={t('about_page.roadmap_title')} eyebrow={t('about_page.roadmap_eyebrow')}>
        <div className="grid gap-3 md:grid-cols-3">
          {roadmapItems.map((item) => (
            <div className="surface-muted p-4" key={item.key}>
              <h3 className="font-semibold text-white">{t(`about_page.${item.key}`)}</h3>
              <p className="mt-2 text-sm leading-6 text-steel-300">{t('about_page.roadmap_detail')}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
