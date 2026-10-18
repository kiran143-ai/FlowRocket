import React from 'react';
import { FlagIcon } from 'lucide-react';

export function FlagIndicator({ kind, active }: {kind: 'rush' | 'rework';active: boolean;}) {
  if (!active) return <span className="sr-only">No</span>;
  const label = kind === 'rush' ? 'Rush' : 'Rework';
  return (
    <span className="inline-flex items-center" title={label}>
      <FlagIcon
        aria-hidden="true"
        className={kind === 'rush' ? 'h-4 w-4 fill-danger-500 text-danger-600' : 'h-4 w-4 fill-warning-500 text-warning-600'} />
      
      <span className="sr-only">{label}</span>
    </span>);

}