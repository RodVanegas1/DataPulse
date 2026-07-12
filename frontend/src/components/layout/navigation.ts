import { Bot, ChartNoAxesCombined, Database, Download, FileText, Home, Info, Map, Menu, Settings } from 'lucide-react';

export const navItems = [
  { id: 'dashboard', labelKey: 'nav.dashboard', icon: Home },
  { id: 'map', labelKey: 'nav.map', icon: Map },
  { id: 'analytics', labelKey: 'nav.analytics', icon: ChartNoAxesCombined },
  { id: 'reports', labelKey: 'nav.reports', icon: FileText },
  { id: 'datasets', labelKey: 'nav.datasets', icon: Database },
  { id: 'assistant', labelKey: 'nav.assistant', icon: Bot },
  { id: 'downloads', labelKey: 'nav.downloads', icon: Download },
  { id: 'about', labelKey: 'nav.about', icon: Info },
  { id: 'settings', labelKey: 'nav.settings', icon: Settings },
] as const;

export type NavId = (typeof navItems)[number]['id'];
export { Menu };
