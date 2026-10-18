import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ValueRowProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

/** Read-only label/value pair. Must be rendered inside a <dl>. */
export function ValueRow({ label, children, className }: ValueRowProps) {
  return (
    <div className={twMerge('grid grid-cols-[132px_minmax(0,1fr)] items-center gap-3 py-1', className)}>
      <dt className="text-right text-[13px] text-ink-500">{label}</dt>
      <dd className="text-sm font-medium tabular-nums text-ink-900">{children}</dd>
    </div>);

}