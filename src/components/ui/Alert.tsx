import React from 'react';
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

type AlertTone = 'info' | 'success' | 'warning' | 'danger';

const config: Record<AlertTone, {cls: string;icon: React.ReactNode;}> = {
  info: { cls: 'border-brand-200 bg-brand-50 text-brand-900 [&_svg]:text-brand-600', icon: <InfoIcon /> },
  success: { cls: 'border-success-100 bg-success-50 text-success-700 [&_svg]:text-success-600', icon: <CircleCheckIcon /> },
  warning: { cls: 'border-warning-100 bg-warning-50 text-warning-700 [&_svg]:text-warning-600', icon: <TriangleAlertIcon /> },
  danger: { cls: 'border-danger-100 bg-danger-50 text-danger-700 [&_svg]:text-danger-600', icon: <CircleAlertIcon /> }
};

interface AlertProps {
  tone?: AlertTone;
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function Alert({ tone = 'info', title, children, className }: AlertProps) {
  const { cls, icon } = config[tone];
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={twMerge('flex gap-2.5 rounded-md border px-3 py-2.5 text-[13px] leading-5', cls, className)}>
      <span className="mt-0.5 shrink-0 [&>svg]:h-4 [&>svg]:w-4" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={title ? 'mt-0.5' : undefined}>{children}</div>}
      </div>
    </div>);

}