import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { SearchFilters } from '../../lib/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface FilterPanelProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}

const categories = [
  'tourism',
  'hotels',
  'restaurants',
  'museums',
  'culture',
  'protected-areas',
  'lakes',
  'volcanoes',
  'events',
  'rivers',
  'transport',
  'infrastructure',
  'education',
  'health',
  'economy',
  'environment',
  'security',
];

const departments = ['san-salvador', 'la-libertad', 'santa-ana', 'sonsonate', 'san-miguel', 'usulutan'];
const quickChips = ['tourism', 'culture', 'protected-areas', 'volcanoes', 'environment', 'security'];

const emptyFilters: SearchFilters = {
  searchText: '',
  categories: [],
  departmentSlug: '',
  municipalitySlug: '',
  district: '',
  tags: [],
  dateFrom: '',
  dateTo: '',
};

function toggle(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const { t } = useTranslation();

  const activeCount =
    filters.categories.length +
    filters.tags.length +
    Number(Boolean(filters.searchText)) +
    Number(Boolean(filters.departmentSlug)) +
    Number(Boolean(filters.municipalitySlug)) +
    Number(Boolean(filters.district)) +
    Number(Boolean(filters.dateFrom || filters.dateTo));

  function addTag(value: string) {
    const tag = value.trim().toLowerCase();
    if (!tag || filters.tags.includes(tag)) return;
    onChange({ ...filters, tags: [...filters.tags, tag] });
  }

  return (
    <section className="surface p-4" aria-label="Territorial filters">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-pulse-cyan">{t('filters.eyebrow')}</p>
          <h2 className="text-base font-semibold text-white">{t('filters.title')}</h2>
        </div>
        <Button
          icon={<SlidersHorizontal size={16} />}
          onClick={() => onChange(emptyFilters)}
        >
          {t('filters.reset')}
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {quickChips.map((category) => {
          const active = filters.categories.includes(category);
          return (
            <button
              className={`rounded-md border px-2.5 py-1.5 text-xs font-semibold capitalize transition focus:outline-none focus:ring-2 focus:ring-pulse-cyan/50 ${
                active ? 'border-pulse-cyan bg-pulse-cyan text-ink-950' : 'border-white/10 bg-white/5 text-steel-300 hover:text-white'
              }`}
              key={category}
              onClick={() => onChange({ ...filters, categories: toggle(filters.categories, category) })}
            >
              {category.replace(/-/g, ' ')}
            </button>
          );
        })}
      </div>

      <details className="group mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-3" open>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-white">
          {t('filters.search_geo')}
          <ChevronDown className="transition group-open:rotate-180" size={16} />
        </summary>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-steel-500">{t('filters.search_label')}</span>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-steel-500" size={16} />
              <input className="field pl-9" value={filters.searchText} onChange={(event) => onChange({ ...filters, searchText: event.target.value })} placeholder={t('filters.search_placeholder')} />
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-steel-500">{t('filters.department_label')}</span>
            <select className="field capitalize" value={filters.departmentSlug} onChange={(event) => onChange({ ...filters, departmentSlug: event.target.value })}>
              <option value="">{t('filters.all_departments')}</option>
              {departments.map((department) => (
                <option value={department} key={department}>
                  {department.replace(/-/g, ' ')}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-steel-500">{t('filters.municipality_label')}</span>
            <input className="field" value={filters.municipalitySlug} onChange={(event) => onChange({ ...filters, municipalitySlug: event.target.value })} placeholder={t('filters.municipality_placeholder')} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-steel-500">{t('filters.district_label')}</span>
            <input className="field" value={filters.district} onChange={(event) => onChange({ ...filters, district: event.target.value })} placeholder={t('filters.district_placeholder')} />
          </label>
        </div>
      </details>

      <details className="group mt-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-white">
          {t('filters.categories_tags')}
          <ChevronDown className="transition group-open:rotate-180" size={16} />
        </summary>
        <div className="mt-4">
          <span className="mb-2 block text-xs font-semibold text-steel-500">{t('filters.layer_categories')}</span>
          <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto pr-1">
            {categories.map((category) => {
              const active = filters.categories.includes(category);
              return (
                <button
                  className={`rounded-md border px-2.5 py-1.5 text-xs font-semibold capitalize transition focus:outline-none focus:ring-2 focus:ring-pulse-cyan/50 ${
                    active ? 'border-pulse-cyan bg-pulse-cyan text-ink-950' : 'border-white/10 bg-white/5 text-steel-300 hover:text-white'
                  }`}
                  key={category}
                  onClick={() => onChange({ ...filters, categories: toggle(filters.categories, category) })}
                >
                  {category.replace(/-/g, ' ')}
                </button>
              );
            })}
          </div>
          <label className="mt-4 block">
            <span className="mb-1 block text-xs font-semibold text-steel-500">{t('filters.tags_label')}</span>
            <input
              className="field"
              placeholder={t('filters.tags_placeholder')}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addTag(event.currentTarget.value);
                  event.currentTarget.value = '';
                }
              }}
            />
          </label>
        </div>
      </details>

      <details className="group mt-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-white">
          {t('filters.date_range')}
          <ChevronDown className="transition group-open:rotate-180" size={16} />
        </summary>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-steel-500">{t('filters.from')}</span>
            <input className="field" type="date" value={filters.dateFrom} onChange={(event) => onChange({ ...filters, dateFrom: event.target.value })} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-steel-500">{t('filters.to')}</span>
            <input className="field" type="date" value={filters.dateTo} onChange={(event) => onChange({ ...filters, dateTo: event.target.value })} />
          </label>
        </div>
      </details>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{activeCount || t('filters.none')} {t('filters.active_filters')}</Badge>
        <Badge>{filters.departmentSlug || t('filters.all_departments')}</Badge>
        <Badge>{filters.dateFrom || t('filters.open_start')} to {filters.dateTo || t('filters.open_end')}</Badge>
        {filters.tags.map((tag) => (
          <button
            className="badge transition hover:border-pulse-rose/50 hover:text-white"
            key={tag}
            onClick={() => onChange({ ...filters, tags: filters.tags.filter((item) => item !== tag) })}
            aria-label={`${t('filters.remove_tag')} ${tag}`}
          >
            {tag}
            <X size={12} />
          </button>
        ))}
      </div>
    </section>
  );
}
