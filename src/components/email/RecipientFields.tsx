import React from 'react';
import { InfoIcon } from 'lucide-react';
import { Recipients } from '../../types/workspace';
import { Select } from '../ui/Select';
import { RecipientInput } from './RecipientInput';

interface RecipientFieldsProps {
  idPrefix: string;
  value: Recipients;
  onChange: (value: Recipients) => void;
  fromOptions: string[];
  toError?: string;
}

export function RecipientFields({ idPrefix, value, onChange, fromOptions, toError }: RecipientFieldsProps) {
  const set = <K extends keyof Recipients,>(key: K, v: Recipients[K]) => onChange({ ...value, [key]: v });

  return (
    <fieldset className="rounded-lg border border-ink-200 p-4">
      <legend className="px-1 text-sm font-semibold text-ink-900">Recipient(s)</legend>
      <div className="space-y-3">
        <p className="text-xs font-semibold text-ink-700">Email</p>
        <div className="grid gap-x-3 gap-y-1 sm:grid-cols-[48px_minmax(0,1fr)] sm:items-center">
          <label htmlFor={`${idPrefix}-from`} className="text-[13px] font-medium text-ink-700 sm:text-right">
            From
          </label>
          <div className="flex items-center gap-2">
            <Select id={`${idPrefix}-from`} wrapperClassName="max-w-sm" value={value.from} onChange={(e) => set('from', e.target.value)}>
              {fromOptions.map((o) =>
              <option key={o}>{o}</option>
              )}
            </Select>
            <span title="Replies are sent from the selected shared mailbox" className="text-brand-600">
              <InfoIcon className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Replies are sent from the selected shared mailbox</span>
            </span>
          </div>
        </div>
        <RecipientInput id={`${idPrefix}-to`} label="To" values={value.to} onChange={(v) => set('to', v)} error={toError} />
        <RecipientInput id={`${idPrefix}-cc`} label="Cc" values={value.cc} onChange={(v) => set('cc', v)} />
        <RecipientInput id={`${idPrefix}-bcc`} label="Bcc" values={value.bcc} onChange={(v) => set('bcc', v)} />
        <p className="border-t border-ink-100 pt-3 text-xs font-semibold text-ink-700">Fax</p>
        <RecipientInput id={`${idPrefix}-fax`} label="To" values={value.fax} onChange={(v) => set('fax', v)} />
      </div>
    </fieldset>);

}