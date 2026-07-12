import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Globe } from 'lucide-react';

const languages = [
  { code: 'es', labelKey: 'topbar.spanish' },
  { code: 'en', labelKey: 'topbar.english' },
] as const;

export function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const current = languages.find((language) => language.code === i18n.language) ?? languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectLanguage(code: string) {
    void i18n.changeLanguage(code);
    setOpen(false);
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-label={t('topbar.language')}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="secondary-button !px-3 !py-2 text-sm"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <Globe size={16} />
        <span className="text-sm font-semibold">{t(current.labelKey)}</span>
        <ChevronDown size={14} className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul
          className="absolute right-0 z-30 mt-2 w-40 overflow-hidden rounded-md border border-white/10 bg-ink-900 py-1 shadow-panel"
          role="listbox"
        >
          {languages.map((language) => (
            <li key={language.code}>
              <button
                aria-selected={language.code === i18n.language}
                className={`flex w-full items-center px-3 py-2 text-left text-sm font-medium transition ${
                  language.code === i18n.language ? 'bg-pulse-cyan text-ink-950' : 'text-steel-300 hover:bg-white/7 hover:text-white'
                }`}
                onClick={() => selectLanguage(language.code)}
                role="option"
                type="button"
              >
                {t(language.labelKey)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
