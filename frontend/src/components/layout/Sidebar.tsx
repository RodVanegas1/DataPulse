import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PRODUCT_NAME, PRODUCT_TAGLINE } from '../../lib/brand';
import { Button } from '../ui/Button';
import { LanguageSelector } from './LanguageSelector';
import { navItems, type NavId } from './navigation';

interface SidebarProps {
  active: NavId;
  onChange: (id: NavId) => void;
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ active, onChange, open, onClose }: SidebarProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className={`fixed inset-0 z-30 bg-black/60 transition lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} onClick={onClose} />
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[292px] border-r border-white/10 bg-ink-950 px-4 py-5 transition-transform lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <img src="/icons/icon.svg" alt="LA OLLA DE DATOS" className="h-12 w-12 object-contain" />
              <div className="min-w-0">
                <h1 className="truncate text-lg font-bold text-white">{PRODUCT_NAME}</h1>
                <p className="truncate text-xs text-steel-500">{PRODUCT_TAGLINE}</p>
              </div>
            </div>
          </div>
          <Button aria-label="Close navigation" icon={<X size={18} />} onClick={onClose} variant="icon" className="lg:hidden" />
        </div>

        <div className="mt-4 sm:hidden">
          <LanguageSelector />
        </div>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const selected = active === item.id;
            return (
              <button
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-semibold transition ${
                  selected ? 'bg-pulse-cyan text-ink-950' : 'text-steel-300 hover:bg-white/7 hover:text-white'
                }`}
                key={item.id}
                onClick={() => {
                  onChange(item.id);
                  onClose();
                }}
              >
                <Icon size={18} />
                <span>{t(item.labelKey)}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <p className="text-sm font-semibold text-white">{t('sidebar.pwa_title')}</p>
          <p className="mt-1 text-xs leading-5 text-steel-500">{t('sidebar.pwa_detail')}</p>
        </div>
      </aside>
    </>
  );
}
