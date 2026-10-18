export const controlBase =
'w-full rounded-md border bg-white px-3 text-ink-900 placeholder:text-ink-400 transition-[border-color,box-shadow] duration-150 ease-out focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-400 read-only:bg-ink-50';

export const controlValid = 'border-ink-200 hover:border-ink-300 focus:border-brand-500 focus:ring-brand-500/25';

export const controlInvalid = 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/25';

export const controlSizes = {
  sm: 'h-8 text-[13px]',
  md: 'h-9 text-sm'
} as const;