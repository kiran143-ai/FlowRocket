import React, { useId } from 'react';
import { twMerge } from 'tailwind-merge';

interface PanelProps {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Panel({ title, icon, actions, children, className, bodyClassName }: PanelProps) {
  const titleId = useId();
  return (
    <section aria-labelledby={title ? titleId : undefined} className={twMerge('rounded-lg border border-ink-200 bg-white shadow-xs', className)}>
      {title &&
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            {icon &&
          <span className="text-brand-600 [&>svg]:h-4 [&>svg]:w-4" aria-hidden="true">
                {icon}
              </span>
          }
            <h2 id={titleId} className="truncate text-[15px] font-semibold text-ink-900">
              {title}
            </h2>
          </div>
          {actions && <div className="flex flex-wrap items-center gap-1.5">{actions}</div>}
        </header>
      }
      <div className={twMerge('p-4', bodyClassName)}>{children}</div>
    </section>);

}