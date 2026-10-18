import React, { forwardRef } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { controlBase, controlInvalid, controlSizes, controlValid } from '../../utils/styles';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  selectSize?: 'sm' | 'md';
  invalid?: boolean;
  wrapperClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
{ selectSize = 'md', invalid = false, wrapperClassName, className, children, ...rest },
ref)
{
  return (
    <div className={twMerge('relative w-full', wrapperClassName)}>
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={twMerge(controlBase, controlSizes[selectSize], invalid ? controlInvalid : controlValid, 'cursor-pointer appearance-none pr-8', className)}
        {...rest}>
        
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" aria-hidden="true" />
    </div>);

});