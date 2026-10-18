import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  srOnlyLabel?: boolean;
}

export function Checkbox({ label, srOnlyLabel = false, className, disabled, ...rest }: CheckboxProps) {
  return (
    <label className={twMerge('inline-flex items-center gap-2 text-sm', disabled ? 'cursor-not-allowed text-ink-400' : 'cursor-pointer text-ink-900', className)}>
      <input type="checkbox" disabled={disabled} className="focus-ring h-4 w-4 shrink-0 cursor-pointer rounded accent-brand-600 disabled:cursor-not-allowed" {...rest} />
      <span className={srOnlyLabel ? 'sr-only' : undefined}>{label}</span>
    </label>);

}