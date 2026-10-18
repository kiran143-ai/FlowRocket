import React from 'react';
import { twMerge } from 'tailwind-merge';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-ink-100 text-ink-700 ring-ink-200',
  info: 'bg-brand-50 text-brand-700 ring-brand-200',
  success: 'bg-success-50 text-success-700 ring-success-100',
  warning: 'bg-warning-50 text-warning-700 ring-warning-100',
  danger: 'bg-danger-50 text-danger-700 ring-danger-100'
};

const dots: Record<BadgeTone, string> = {
  neutral: 'bg-ink-400',
  info: 'bg-brand-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500'
};

interface BadgeProps {
  tone?: BadgeTone;
  dot?: boolean;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function Badge({ tone = 'neutral', dot = false, icon, className, children }: BadgeProps) {
  return (
    <span className={twMerge('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset [&>svg]:h-3 [&>svg]:w-3', tones[tone], className)}>
      {dot && <span className={twMerge('h-1.5 w-1.5 rounded-full', dots[tone])} aria-hidden="true" />}
      {icon}
      {children}
    </span>);

}