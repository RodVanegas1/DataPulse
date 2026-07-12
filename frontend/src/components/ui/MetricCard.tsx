import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  detail: string;
  icon: ReactNode;
}

export function MetricCard({ label, value, detail, icon }: MetricCardProps) {
  return (
    <div className="surface-muted min-h-[132px] p-4">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-steel-300">{label}</span>
        <span className="grid h-9 w-9 place-items-center rounded-md bg-pulse-cyan/12 text-pulse-cyan">{icon}</span>
      </div>
      <div className="mt-5 text-3xl font-bold text-white">{value}</div>
      <p className="mt-2 text-sm text-steel-500">{detail}</p>
    </div>
  );
}
