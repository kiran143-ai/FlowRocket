import React from 'react';
import { twMerge } from 'tailwind-merge';

interface AvatarProps {
  initials: string;
  tone?: 'brand' | 'danger' | 'warning' | 'neutral';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const tones = {
  brand: 'bg-brand-600 text-white',
  danger: 'bg-danger-600 text-white',
  warning: 'bg-warning-600 text-white',
  neutral: 'bg-ink-100 text-ink-700'
};

const sizes = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-2xl'
};

export function Avatar({ initials, tone = 'brand', size = 'md', className }: AvatarProps) {
  return (
    <span aria-hidden="true" className={twMerge('inline-grid shrink-0 select-none place-items-center rounded-full font-semibold', tones[tone], sizes[size], className)}>
      {initials}
    </span>);

}