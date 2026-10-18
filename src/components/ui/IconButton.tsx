import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'ghost' | 'outline' | 'onBrand' | 'danger';
  size?: 'sm' | 'md';
}

const variants = {
  ghost: 'text-ink-500 hover:bg-ink-100 hover:text-ink-900 active:bg-ink-200',
  outline: 'border border-ink-200 bg-white text-ink-700 shadow-xs hover:border-ink-300 hover:bg-ink-50 active:bg-ink-100',
  onBrand: 'text-white/90 hover:bg-white/15 hover:text-white active:bg-white/20 focus-visible:ring-white focus-visible:ring-offset-brand-700',
  danger: 'text-danger-600 hover:bg-danger-50 hover:text-danger-700 active:bg-danger-100'
};

const sizes = { sm: 'h-7 w-7', md: 'h-8 w-8' };

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
{ label, variant = 'ghost', size = 'md', className, children, type = 'button', ...rest },
ref)
{
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={twMerge(
        'focus-ring relative inline-flex shrink-0 items-center justify-center rounded-md transition-[background-color,border-color,color] duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:h-4 [&_svg]:w-4',
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}>
      
      {children}
    </button>);

});