import { Menu, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PRODUCT_NAME } from '../../lib/brand';
import { Button } from '../ui/Button';
import { LanguageSelector } from './LanguageSelector';

interface TopbarProps {
  title: string;
  onMenu: () => void;
}

export function Topbar({ title, onMenu }: TopbarProps) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-ink-950/90 px-4 py-3 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <Button aria-label="Open navigation" icon={<Menu size={20} />} onClick={onMenu} variant="icon" className="lg:hidden" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-pulse-cyan">{PRODUCT_NAME}</p>
          <h2 className="truncate text-lg font-bold text-white sm:text-xl">{title}</h2>
        </div>
        <div className="hidden min-w-[260px] items-center gap-2 rounded-md border border-white/10 bg-ink-900 px-3 py-2 md:flex">
          <Search size={16} className="text-steel-500" />
          <span className="text-sm text-steel-500">{t('common.search_placeholder')}</span>
        </div>
        <div className="hidden sm:block">
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
