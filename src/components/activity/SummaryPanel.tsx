import React, { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon, FileTextIcon, MailIcon, MenuIcon, PrinterIcon } from 'lucide-react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { CaseRecord } from '../../types/case';
import { Checkbox } from '../ui/Checkbox';
import { ColumnPanel } from './ColumnPanel';

type SectionKey = 'claimant' | 'team' | 'rating';
type GroupKey = 'broker' | 'underwriters' | 'rating';

const headerBtn = 'focus-ring grid h-7 w-7 place-items-center rounded text-ink-500 transition-colors duration-150 hover:bg-ink-100 hover:text-ink-900';

function Group({ label, open, onToggle, children }: {label: string;open: boolean;onToggle: () => void;children: React.ReactNode;}) {
  return (
    <div className="mt-2">
      <button type="button" aria-expanded={open} onClick={onToggle} className="focus-ring inline-flex items-center gap-1 rounded text-[13px] font-medium text-brand-700 hover:text-brand-900">
        <ChevronDownIcon className={twMerge('h-4 w-4 transition-transform duration-150', !open && '-rotate-90')} aria-hidden="true" />
        {label}
      </button>
      {open && <div className="mt-2 pl-5">{children}</div>}
    </div>);

}

const yn = (b: boolean) => b ? 'Yes' : 'No';

export function SummaryPanel({ caseRecord: c }: {caseRecord: CaseRecord;}) {
  const [included, setIncluded] = useState<Record<SectionKey, boolean>>({ claimant: true, team: true, rating: true });
  const [open, setOpen] = useState<Record<GroupKey, boolean>>({ broker: true, underwriters: true, rating: true });
  const selectAllRef = useRef<HTMLInputElement>(null);
  const values = Object.values(included);
  const all = values.every(Boolean);
  const some = values.some(Boolean);
  const count = values.filter(Boolean).length;

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = some && !all;
  }, [some, all]);

  const output = (kind: string) =>
  count ? toast.success(`${kind}: ${count} summary ${count === 1 ? 'section' : 'sections'}`) : toast.error('Select at least one summary section first.');

  const toggleGroup = (k: GroupKey) => setOpen((o) => ({ ...o, [k]: !o[k] }));
  const r = c.rating;

  return (
    <ColumnPanel
      title="Summary"
      tone="warning"
      icon={<MenuIcon />}
      actions={
      <>
          <label className="mr-2 inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-ink-700">
            <input
            ref={selectAllRef}
            type="checkbox"
            checked={all}
            onChange={() => setIncluded({ claimant: !all, team: !all, rating: !all })}
            className="focus-ring h-4 w-4 cursor-pointer accent-brand-600" />
          
            Select All
          </label>
          <button type="button" aria-label="Print selected sections" title="Print" className={headerBtn} onClick={() => output('Print')}>
            <PrinterIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" aria-label="Export selected sections to PDF" title="PDF" className={headerBtn} onClick={() => output('PDF')}>
            <FileTextIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" aria-label="Email selected sections" title="Email" className={headerBtn} onClick={() => output('Email')}>
            <MailIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </>
      }>
      
      <h3 className="text-base font-semibold text-brand-700">
        {c.caseNumber}-{c.claimantName} (SS)
      </h3>
      <p className="text-xs text-ink-500">
        created by {c.createdBy} on {c.createdOn}
      </p>

      <div className="mt-4 space-y-4 divide-y divide-ink-100">
        <div>
          <Checkbox label={<span className="font-semibold">Claimant Information</span>} checked={included.claimant} onChange={() => setIncluded((s) => ({ ...s, claimant: !s.claimant }))} />
          <dl className="mt-2 grid grid-cols-[120px_1fr] gap-x-3 gap-y-1 pl-6 text-[13px]">
            <dt className="text-ink-500">Claimant Name:</dt>
            <dd className="font-medium">{c.claimantName}</dd>
            <dt className="text-ink-500">Date of birth:</dt>
            <dd className="font-medium tabular-nums">{c.dob}</dd>
            <dt className="text-ink-500">Gender:</dt>
            <dd className="font-medium">{c.gender}</dd>
            <dt className="text-ink-500">Age Now:</dt>
            <dd className="font-medium">{c.ageNow}</dd>
          </dl>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 pl-6 text-xs text-ink-700" aria-label="Case flags">
            <li>Rush: {yn(c.flags.rush)}</li>
            <li>Rework: {yn(c.flags.rework)}</li>
            <li>Mediation: {yn(c.flags.mediation)}</li>
            <li>MSA: {yn(c.flags.msa)}</li>
            <li>
              WC: <span className={c.flags.wc ? 'font-semibold text-success-700' : undefined}>{yn(c.flags.wc)}</span>
            </li>
          </ul>
        </div>

        <div id="team" className="pt-4">
          <Checkbox label={<span className="font-semibold">Team</span>} checked={included.team} onChange={() => setIncluded((s) => ({ ...s, team: !s.team }))} />
          <div className="pl-6">
            <Group label="Broker Firm" open={open.broker} onToggle={() => toggleGroup('broker')}>
              <p className="text-[13px] font-semibold">{c.broker.firm}</p>
            </Group>
            <Group label="Medical Underwriters" open={open.underwriters} onToggle={() => toggleGroup('underwriters')}>
              <p className="text-[13px] font-semibold">{c.underwriter.name}</p>
              <dl className="mt-1 grid grid-cols-[64px_1fr] gap-x-2 gap-y-0.5 text-xs text-ink-700">
                <dt className="text-ink-500">Email:</dt>
                <dd className="break-all">{c.underwriter.email}</dd>
                <dt className="text-ink-500">Phone:</dt>
                <dd>{c.underwriter.phone}</dd>
                <dt className="text-ink-500">Address:</dt>
                <dd>{c.underwriter.address}</dd>
              </dl>
            </Group>
          </div>
        </div>

        <div className="pt-4">
          <Checkbox label={<span className="font-semibold">Rating</span>} checked={included.rating} onChange={() => setIncluded((s) => ({ ...s, rating: !s.rating }))} />
          <div className="pl-6">
            <Group label={c.underwriter.name} open={open.rating} onToggle={() => toggleGroup('rating')}>
              {r ?
              <dl className="grid grid-cols-[120px_1fr] gap-x-3 gap-y-0.5 text-[13px]">
                  <dt className="text-ink-500">Final Rated Age:</dt>
                  <dd className="font-semibold text-danger-600">{r.finalRatedAge}</dd>
                  <dt className="text-ink-500">Normal L.E.:</dt>
                  <dd className="tabular-nums">{r.normalLE.toFixed(2)}</dd>
                  <dt className="text-ink-500">Date Evaluated:</dt>
                  <dd className="tabular-nums">{r.dateEvaluated}</dd>
                </dl> :

              <p className="text-[13px] text-ink-500">No Records</p>
              }
            </Group>
          </div>
        </div>
      </div>
    </ColumnPanel>);

}