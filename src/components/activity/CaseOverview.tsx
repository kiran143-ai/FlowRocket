import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, ClipboardPenIcon, DownloadIcon, EyeIcon, SendIcon } from 'lucide-react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { CaseRecord } from '../../types/case';
import { CASE_STAGES, caseStage, raFileName } from '../../utils/raSheet';
import { downloadRASheet } from '../../utils/raSheetPdf';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

function Figure({ label, value, tone = 'text-ink-900' }: {label: string;value: React.ReactNode;tone?: string;}) {
  return (
    <div className="min-w-[88px]">
      <dt className="text-xs text-ink-500">{label}</dt>
      <dd className={twMerge('mt-0.5 text-lg font-semibold tabular-nums', tone)}>{value}</dd>
    </div>);

}

export function CaseOverview({ caseRecord: c }: {caseRecord: CaseRecord;}) {
  const navigate = useNavigate();
  const base = `/case/${c.caseNumber}`;
  const r = c.rating;
  const stage = caseStage(c);
  const stageIdx = CASE_STAGES.findIndex((s) => s.id === stage);
  const flags = [c.flags.rush && 'Rush', c.flags.rework && 'Rework', c.flags.mediation && 'Mediation', c.flags.msa && 'MSA', c.flags.wc && 'WC'].filter(Boolean) as string[];

  const next =
  stage === 'received' ?
  { title: 'Next: rate this case', body: 'Use the life expectancy table to calculate the rated age.', cta: 'Rate case', icon: <ClipboardPenIcon />, go: () => navigate(`${base}/rating/edit`) } :
  stage === 'sheet' ?
  { title: 'Next: send the RA to the broker', body: `Email the confirmation sheet to ${c.broker.contact}.`, cta: 'Send to broker', icon: <SendIcon />, go: () => navigate(`${base}/message`) } :
  { title: 'All done', body: `RA confirmation was sent to ${c.broker.firm}.`, cta: 'View RA sheet', icon: <EyeIcon />, go: () => navigate(`${base}/ra-sheet`) };

  return (
    <section aria-labelledby="case-overview" className="rounded-lg border border-ink-200 bg-white shadow-xs">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 p-5">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar initials={c.initials} size="lg" />
          <div className="min-w-0">
            <h2 id="case-overview" className="text-lg font-semibold text-ink-900">
              {c.claimantName}
            </h2>
            <p className="text-[13px] text-ink-500">
              Case # <span className="tabular-nums">{c.caseNumber}</span> · {c.gender} · DOB {c.dob} · {c.ageNow}
            </p>
            {flags.length > 0 &&
            <div className="mt-1.5 flex flex-wrap gap-1" aria-label="Case flags">
                {flags.map((f) =>
              <Badge key={f} tone={f === 'Rush' || f === 'Rework' ? 'warning' : 'neutral'}>
                    {f}
                  </Badge>
              )}
              </div>
            }
          </div>
        </div>

        <dl className="flex flex-wrap gap-x-6 gap-y-3 border-ink-100 lg:border-l lg:pl-8">
          <Figure label="Final rated age" value={r ? r.finalRatedAge : '—'} tone={r ? 'text-danger-600' : 'text-ink-400'} />
          <Figure label="Actual age" value={r ? r.age : '—'} tone={r ? undefined : 'text-ink-400'} />
          <Figure label="Normal L.E." value={r ? r.normalLE.toFixed(2) : '—'} tone={r ? undefined : 'text-ink-400'} />
          <Figure label="Valid through" value={r ? r.expirationDate : '—'} tone={r ? undefined : 'text-ink-400'} />
        </dl>

        {r &&
        <div className="ml-auto">
            <Button
            size="sm"
            leadingIcon={<DownloadIcon />}
            onClick={() => {
              downloadRASheet(c);
              toast.success('RA sheet downloaded', { description: raFileName(c) });
            }}>

              RA sheet PDF
            </Button>
          </div>
        }
      </div>

      <div className="grid gap-4 border-t border-ink-100 bg-ink-50/60 px-5 py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <ol aria-label="Case progress" className="flex flex-wrap items-center gap-y-2">
          {CASE_STAGES.map((s, i) => {
            const done = i <= stageIdx;
            const current = i === stageIdx + 1;
            return (
              <li key={s.id} className="flex items-center" aria-current={current ? 'step' : undefined}>
                <span
                  className={twMerge(
                    'grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold',
                    done ? 'bg-success-600 text-white' : current ? 'bg-white text-brand-700 ring-2 ring-brand-500' : 'bg-white text-ink-400 ring-1 ring-ink-200'
                  )}>

                  {done ? <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" /> : i + 1}
                </span>
                <span className={twMerge('ml-2 text-[13px]', done ? 'font-medium text-ink-900' : current ? 'font-semibold text-brand-700' : 'text-ink-500')}>
                  {s.label}
                  <span className="sr-only">{done ? ' (done)' : current ? ' (current step)' : ''}</span>
                </span>
                {i < CASE_STAGES.length - 1 && <span className={twMerge('mx-3 h-px w-8 sm:w-12', i < stageIdx ? 'bg-success-500' : 'bg-ink-200')} aria-hidden="true" />}
              </li>);

          })}
        </ol>
        <div className="flex items-center gap-3 rounded-md border border-brand-200 bg-white py-2 pl-3 pr-2">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-ink-900">{next.title}</p>
            <p className="text-xs text-ink-500">{next.body}</p>
          </div>
          <Button size="sm" variant={stage === 'communicated' ? 'secondary' : 'primary'} leadingIcon={next.icon} onClick={next.go}>
            {next.cta}
          </Button>
        </div>
      </div>
    </section>);

}
