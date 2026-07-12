import { useTranslation } from 'react-i18next';
import { Card } from '../components/ui/Card';

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <Card title={t('settings_page.title')} eyebrow={t('settings_page.eyebrow')}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="surface-muted flex items-center justify-between gap-4 p-4">
          <span>
            <span className="block font-semibold text-white">{t('settings_page.dark_theme')}</span>
            <span className="text-sm text-steel-500">{t('settings_page.dark_theme_detail')}</span>
          </span>
          <input type="checkbox" defaultChecked className="h-5 w-5 accent-pulse-cyan" />
        </label>
        <label className="surface-muted flex items-center justify-between gap-4 p-4">
          <span>
            <span className="block font-semibold text-white">{t('settings_page.high_contrast')}</span>
            <span className="text-sm text-steel-500">{t('settings_page.high_contrast_detail')}</span>
          </span>
          <input type="checkbox" className="h-5 w-5 accent-pulse-cyan" />
        </label>
      </div>
    </Card>
  );
}
