import React, { useState } from 'react';
import { BookUserIcon, CopyIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { IconButton } from '../ui/IconButton';

interface RecipientInputProps {
  id: string;
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  error?: string;
}

export function RecipientInput({ id, label, values, onChange, error }: RecipientInputProps) {
  const [draft, setDraft] = useState('');

  const commit = () => {
    const v = draft.trim().replace(/,$/, '');
    if (!v) return;
    if (!values.includes(v)) onChange([...values, v]);
    setDraft('');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Backspace' && !draft && values.length) {
      onChange(values.slice(0, -1));
    }
  };

  return (
    <div className="grid gap-x-3 gap-y-1 sm:grid-cols-[48px_minmax(0,1fr)] sm:items-start">
      <label htmlFor={id} className="text-[13px] font-medium text-ink-700 sm:pt-2 sm:text-right">
        {label}
      </label>
      <div>
        <div className="flex items-start gap-2">
          <IconButton label={`Choose ${label} recipients from Address Book`} variant="outline" className="mt-0.5 text-brand-700" onClick={() => toast('Address Book isn’t part of this prototype.')}>
            <BookUserIcon />
          </IconButton>
          <div
            className={twMerge(
              'flex min-h-[36px] flex-1 flex-wrap items-center gap-1.5 rounded-md border bg-white px-2 py-1 transition-[border-color,box-shadow] duration-150 focus-within:ring-2',
              error ? 'border-danger-500 focus-within:ring-danger-500/25' : 'border-ink-200 focus-within:border-brand-500 focus-within:ring-brand-500/25 hover:border-ink-300'
            )}>
            
            {values.map((v) =>
            <span key={v} className="inline-flex max-w-full items-center gap-1 rounded bg-brand-50 py-0.5 pl-2 pr-1 text-xs font-medium text-brand-800 ring-1 ring-inset ring-brand-200">
                <span className="truncate">{v}</span>
                <button
                type="button"
                aria-label={`Remove ${v}`}
                onClick={() => onChange(values.filter((x) => x !== v))}
                className="focus-ring grid h-4 w-4 place-items-center rounded text-brand-700 hover:bg-brand-100">
                
                  <XIcon className="h-3 w-3" aria-hidden="true" />
                </button>
              </span>
            )}
            <input
              id={id}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              onBlur={commit}
              aria-invalid={!!error || undefined}
              aria-describedby={error ? `${id}-error` : undefined}
              className="h-7 min-w-[140px] flex-1 bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
              placeholder={values.length ? '' : 'Type an address and press Enter'} />
            
          </div>
          <IconButton
            label={`Copy ${label} recipients`}
            className="mt-0.5"
            onClick={() => {
              navigator.clipboard?.writeText(values.join('; '))?.catch(() => undefined);
              toast.success(`${label} recipients copied`);
            }}>
            
            <CopyIcon />
          </IconButton>
        </div>
        {error &&
        <p id={`${id}-error`} className="ml-10 mt-1 text-xs font-medium text-danger-700">
            {error}
          </p>
        }
      </div>
    </div>);

}