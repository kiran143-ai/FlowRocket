import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      {icon &&
      <span className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-ink-100 text-ink-500 [&>svg]:h-5 [&>svg]:w-5" aria-hidden="true">
          {icon}
        </span>
      }
      <p className="text-sm font-semibold text-ink-900">{title}</p>
      {description && <p className="mt-1 max-w-sm text-[13px] text-ink-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>);

}