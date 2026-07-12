import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Card({ title, eyebrow, action, children, className = '' }: CardProps) {
  return (
    <section className={`surface p-4 sm:p-5 ${className}`}>
      {(title || eyebrow || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {eyebrow && <p className="text-xs font-semibold uppercase tracking-wider text-pulse-cyan">{eyebrow}</p>}
            {title && <h2 className="mt-1 text-base font-semibold text-white sm:text-lg">{title}</h2>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
