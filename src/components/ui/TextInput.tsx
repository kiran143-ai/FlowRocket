import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { controlBase, controlInvalid, controlSizes, controlValid } from '../../utils/styles';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputSize?: 'sm' | 'md';
  invalid?: boolean;
  leadingIcon?: React.ReactNode;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
{ inputSize = 'md', invalid = false, leadingIcon, className, ...rest },
ref)
{
  const input =
  <input
    ref={ref}
    aria-invalid={invalid || undefined}
    className={twMerge(controlBase, controlSizes[inputSize], invalid ? controlInvalid : controlValid, leadingIcon ? 'pl-8' : '', className)}
    {...rest} />;


  if (!leadingIcon) return input;
  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-ink-400 [&>svg]:h-4 [&>svg]:w-4" aria-hidden="true">
        {leadingIcon}
      </span>
      {input}
    </div>);

});