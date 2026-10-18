import React, { forwardRef } from 'react';
import { LoaderCircleIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const base =
'focus-ring inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md font-medium transition-[background-color,border-color,color,box-shadow] duration-150 ease-out disabled:cursor-not-allowed';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-white shadow-xs hover:bg-brand-700 active:bg-brand-800',
  secondary: 'border border-ink-200 bg-white text-ink-900 shadow-xs hover:border-ink-300 hover:bg-ink-50 active:bg-ink-100',
  ghost: 'text-ink-700 hover:bg-ink-100 hover:text-ink-900 active:bg-ink-200',
  danger: 'border border-danger-200 bg-white text-danger-700 shadow-xs hover:border-danger-500 hover:bg-danger-50 active:bg-danger-100'
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 px-3 text-[13px]',
  md: 'h-9 gap-2 px-4 text-sm'
};

const iconWrap = 'inline-flex shrink-0 [&>svg]:h-4 [&>svg]:w-4';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
{ variant = 'secondary', size = 'md', loading = false, leadingIcon, trailingIcon, className, children, disabled, type = 'button', ...rest },
ref)
{
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={twMerge(base, variants[variant], sizes[size], disabled && !loading && 'opacity-50', loading && 'cursor-progress', className)}
      {...rest}>
      
      {loading ?
      <span className={iconWrap} aria-hidden="true">
          <LoaderCircleIcon className="animate-spin" />
        </span> :

      leadingIcon &&
      <span className={iconWrap} aria-hidden="true">
            {leadingIcon}
          </span>

      }
      <span>{children}</span>
      {!loading && trailingIcon &&
      <span className={iconWrap} aria-hidden="true">
          {trailingIcon}
        </span>
      }
    </button>);

});