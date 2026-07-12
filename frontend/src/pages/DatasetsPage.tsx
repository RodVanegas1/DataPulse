import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import type { Dataset } from '../lib/types';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Download } from 'lucide-react';

export default function DatasetsPage({ datasets }: { datasets: Dataset[] }) {
  const { t } = useTranslation();

  return (
    <Card title={t('datasets_page.title')} eyebrow={t('datasets_page.eyebrow')}>
      {datasets.length ? (
        <>
          <DataTable
            columns={['name', 'slug', 'format', 'source']}
            rows={datasets.map((dataset) => ({
              name: dataset.name,
              slug: dataset.slug,
              format: dataset.format ?? 'JSON',
              source: dataset.source ?? 'La Olla de Datos',
            }))}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {datasets.map((dataset) => (
              <a href={`${api.reportUrl('json').replace('/exports/tourism-places?format=json', `/datasets/${dataset.slug}/export?format=json`)}`} key={dataset.slug}>
                <Button icon={<Download size={16} />}>{dataset.name}</Button>
              </a>
            ))}
          </div>
        </>
      ) : (
        <div className="surface-muted p-4 text-sm text-steel-300">{t('datasets_page.empty')}</div>
      )}
    </Card>
  );
}
