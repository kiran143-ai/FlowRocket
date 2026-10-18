import React, { useId } from 'react';
import { twMerge } from 'tailwind-merge';

interface ColumnPanelProps {
  title: string;
  icon: React.ReactNode;
  tone: 'success' | 'warning' | 'brand';
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const tones = {
  success: { bar: 'border-t-success-500', chip: 'bg-success-50 text-success-700' },
  warning: { bar: 'border-t-warning-500', chip: 'bg-warning-50 text-warning-700' },
  brand: { bar: 'border-t-brand-500', chip: 'bg-brand-50 text-brand-700' }
};

export function ColumnPanel({ title, icon, tone, actions, children }: ColumnPanelProps) {
  const id = useId();
  return (
    <section aria-labelledby={id} className={twMerge('flex min-h-0 flex-col overflow-hidden rounded-lg border border-t-[3px] border-ink-200 bg-white shadow-xs', tones[tone].bar)}>
      <header className="flex min-h-[48px] items-center justify-between gap-2 border-b border-ink-100 px-4 py-1.5">
        <h2 id={id} className="flex items-center gap-2 text-sm font-semibold text-ink-900">
          <span className={twMerge('grid h-7 w-7 place-items-center rounded-md [&>svg]:h-4 [&>svg]:w-4', tones[tone].chip)} aria-hidden="true">
            {icon}
          </span>
          {title}
        </h2>
        {actions && <div className="flex items-center gap-0.5">{actions}</div>}
      </header>
      <div className="flex-1 overflow-y-auto p-4 lg:max-h-[calc(100vh-420px)] lg:min-h-[320px]">{children}</div>
    </section>);

}