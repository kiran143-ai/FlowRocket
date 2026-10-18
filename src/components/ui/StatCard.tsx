import React from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export type StatTone = 'brand' | 'warning' | 'success' | 'neutral' | 'danger';

const tones: Record<StatTone, {chip: string;value: string;active: string;}> = {
  brand: { chip: 'bg-brand-50 text-brand-600', value: 'text-brand-700', active: 'border-brand-500 ring-brand-500' },
  warning: { chip: 'bg-warning-50 text-warning-600', value: 'text-warning-700', active: 'border-warning-500 ring-warning-500' },
  success: { chip: 'bg-success-50 text-success-600', value: 'text-success-700', active: 'border-success-500 ring-success-500' },
  danger: { chip: 'bg-danger-50 text-danger-600', value: 'text-danger-700', active: 'border-danger-500 ring-danger-500' },
  neutral: { chip: 'bg-ink-100 text-ink-700', value: 'text-ink-900', active: 'border-ink-500 ring-ink-500' }
};

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  tone?: StatTone;
  hint?: React.ReactNode;
  eyebrow?: string;
  /** Text for the call to action; the whole card becomes a button when onClick is set. */
  action?: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}

export function StatCard({ label, value, icon, tone = 'brand', hint, eyebrow, action, onClick, active = false, className }: StatCardProps) {
  const t = tones[tone];
  const body =
  <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">{eyebrow}</p>}
          <p className="text-[13px] font-medium text-ink-700">{label}</p>
        </div>
        <span className={twMerge('grid h-9 w-9 shrink-0 place-items-center rounded-lg [&>svg]:h-[18px] [&>svg]:w-[18px]', t.chip)} aria-hidden="true">
          {icon}
        </span>
      </div>
      <p className={twMerge('mt-2 text-3xl font-semibold tabular-nums', t.value)}>{value}</p>
      {hint && <p className="mt-1 text-xs leading-5 text-ink-500">{hint}</p>}
      {action &&
    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 group-hover:text-brand-900">
          {action}
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
    }
    </>;


  const cls = twMerge(
    'group flex h-full flex-col rounded-lg border border-ink-200 bg-white p-4 text-left shadow-xs',
    onClick && 'focus-ring transition-[border-color,box-shadow] duration-150 hover:border-ink-300 hover:shadow-card',
    active && twMerge('ring-1', t.active),
    className
  );

  return onClick ?
  <button type="button" onClick={onClick} aria-pressed={active} className={cls}>
      {body}
    </button> :

  <div className={cls}>{body}</div>;

}
