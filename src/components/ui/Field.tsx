import React from 'react';
import { CircleAlertIcon, CircleCheckIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface FieldProps {
  label: React.ReactNode;
  htmlFor: string;
  hint?: React.ReactNode;
  error?: string;
  success?: string;
  required?: boolean;
  layout?: 'stacked' | 'inline';
  className?: string;
  children: React.ReactNode;
}

export function Field({ label, htmlFor, hint, error, success, required, layout = 'stacked', className, children }: FieldProps) {
  const inline = layout === 'inline';
  return (
    <div className={twMerge(inline ? 'grid gap-x-3 gap-y-1 sm:grid-cols-[132px_minmax(0,1fr)] sm:items-start' : 'flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className={twMerge('text-[13px] font-medium text-ink-700', inline && 'sm:pt-2 sm:text-right')}>
        {label}
        {required &&
        <span className="ml-0.5 text-danger-600" aria-hidden="true">
            *
          </span>
        }
        {required && <span className="sr-only"> (required)</span>}
      </label>
      <div className="min-w-0">
        {children}
        {error ?
        <p id={`${htmlFor}-error`} className="mt-1.5 flex items-center gap-1 text-xs font-medium text-danger-700">
            <CircleAlertIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {error}
          </p> :
        success ?
        <p id={`${htmlFor}-success`} className="mt-1.5 flex items-center gap-1 text-xs font-medium text-success-700">
            <CircleCheckIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {success}
          </p> :

        hint &&
        <p id={`${htmlFor}-hint`} className="mt-1.5 text-xs text-ink-500">
              {hint}
            </p>

        }
      </div>
    </div>);

}