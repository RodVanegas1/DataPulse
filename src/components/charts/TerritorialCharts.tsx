import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTranslation } from 'react-i18next';
import type { RankedItem } from '../../lib/types';
import { Card } from '../ui/Card';

interface TerritorialChartsProps {
  departments: RankedItem[];
  categories: RankedItem[];
}

const colors = ['#2dd4bf', '#38bdf8', '#f6c453', '#fb7185', '#a78bfa'];
const swatches = ['bg-pulse-cyan', 'bg-pulse-blue', 'bg-pulse-amber', 'bg-pulse-rose', 'bg-pulse-violet'];

export function TerritorialCharts({ departments, categories }: TerritorialChartsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card title={t('charts.regional_title')} eyebrow={t('charts.regional_eyebrow')}>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departments}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#8ea3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#8ea3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#0a1626', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8 }} />
              <Bar dataKey="places" radius={[4, 4, 0, 0]}>
                {departments.map((_entry, index) => (
                  <Cell key={`department-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card title={t('charts.category_title')} eyebrow={t('charts.category_eyebrow')}>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categories} dataKey="places" nameKey="name" innerRadius={54} outerRadius={94} paddingAngle={2}>
                {categories.map((_entry, index) => (
                  <Cell key={`category-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#0a1626', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-steel-300 sm:grid-cols-4">
          {categories.slice(0, 4).map((category, index) => (
            <div className="flex items-center gap-2" key={category.slug}>
              <span className={`h-2 w-2 rounded-full ${swatches[index % swatches.length]}`} />
              <span className="truncate">{category.name}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
