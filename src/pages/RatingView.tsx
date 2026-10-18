import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CirclePlusIcon, ClipboardListIcon, DownloadIcon, FileTextIcon, FileXIcon, ForwardIcon, HistoryIcon, SquarePenIcon, TagIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { impairmentCodes } from '../data/impairmentCodes';
import { useCase } from '../hooks/useCase';
import { CaseLayout } from '../components/case/CaseLayout';
import { CaseTimeline } from '../components/case/CaseTimeline';
import { EmptyState } from '../components/layout/EmptyState';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { Modal } from '../components/ui/Modal';
import { Panel } from '../components/ui/Panel';
import { Tabs } from '../components/ui/Tabs';
import { raFileName } from '../utils/raSheet';
import { downloadRASheet } from '../utils/raSheetPdf';

function Metric({ label, value, tone = 'text-ink-900', large = false }: {label: string;value: React.ReactNode;tone?: string;large?: boolean;}) {
  return (
    <div>
      <dt className="text-xs font-medium text-ink-500">{label}</dt>
      <dd className={`mt-0.5 font-semibold tabular-nums ${large ? 'text-3xl' : 'text-2xl'} ${tone}`}>{value}</dd>
    </div>);

}

export function RatingView() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const c = useCase(caseId);
  const { saveRating } = useWorkspace();
  const [tab, setTab] = useState('ra');
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!c) return <EmptyState icon={<FileXIcon />} title="Case not found" action={<Link to="/" className="link text-sm">Back to Home Workspace</Link>} />;

  const r = c.rating;
  const base = `/case/${c.caseNumber}`;
  const fileName = raFileName(c);

  return (
    <CaseLayout
      caseRecord={c}
      title={`Rating Activity for ${c.claimantName}`}
      titleAction={
      <IconButton label="Add rating activity" size="sm" className="text-brand-600" onClick={() => navigate(`${base}/rating/edit`)}>
          <CirclePlusIcon />
        </IconButton>
      }>
      
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
        <Panel
          title="Rating Activity"
          actions={
          r &&
          <>
                <IconButton label="Edit rating activity" size="sm" className="text-brand-700" onClick={() => navigate(`${base}/rating/edit`)}>
                  <SquarePenIcon />
                </IconButton>
                <IconButton label="Delete rating activity" size="sm" variant="danger" onClick={() => setConfirmDelete(true)}>
                  <Trash2Icon />
                </IconButton>
              </>

          }
          bodyClassName="p-0">
          
          {r ?
          <>
              <div className="grid gap-6 p-5 md:grid-cols-[160px_minmax(0,1fr)]">
                <div className="flex flex-col items-center text-center">
                  <Avatar initials={c.underwriter.initials} tone="warning" size="xl" />
                  <p className="mt-3 text-sm font-semibold text-brand-700">{r.underwriter.replace(/\s*\(\d+\)$/, '')}</p>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-ink-500">
                    <TagIcon className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                    Underwriter
                  </p>
                </div>
                <div className="space-y-5">
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-lg border border-brand-200 bg-brand-50/50 p-4 sm:grid-cols-5">
                    <Metric label="Age" value={r.age} tone="text-brand-700" />
                    <Metric label="Normal L.E." value={r.normalLE.toFixed(2)} tone="text-brand-700" />
                    <Metric label="75% Normal L.E." value={r.normalLE75.toFixed(2)} tone="text-brand-700" />
                    <Metric label="Estimated L.E." value={r.estimatedLE.toFixed(2)} tone="text-warning-700" />
                    <Metric label="Calculated Rated Age" value={r.calculatedRatedAge} />
                    <div className="col-span-2 flex gap-8 border-t border-brand-200 pt-4 sm:col-span-5">
                      <Metric label="Final Rated Age" value={r.finalRatedAge} tone="text-danger-600" large />
                      <Metric
                      label="# Yrs Rated Up"
                      value={
                      <>
                            {r.calculatedRatedAge - r.age} / <span className="text-danger-600">{r.finalRatedAge - r.age}</span>
                          </>
                      }
                      large />
                    
                    </div>
                  </dl>
                  <dl className="grid gap-x-8 gap-y-1.5 text-[13px] sm:grid-cols-2">
                    {[
                  ['Date Evaluated', r.dateEvaluated],
                  ['Mult Method', r.multMethod],
                  ['DOB', c.dob],
                  ['Mult (%)', String(r.mult)],
                  ['Age', String(r.age)],
                  ['Response Date', r.responseDate],
                  ['Gender', c.gender],
                  ['Expiration Date', r.expirationDate]].
                  map(([k, v]) =>
                  <div key={k} className="grid grid-cols-[120px_1fr] gap-3">
                        <dt className="text-ink-500">{k}</dt>
                        <dd className="font-semibold tabular-nums text-ink-900">{v}</dd>
                      </div>
                  )}
                  </dl>
                </div>
              </div>
              <section aria-labelledby="iv-codes" className="border-t border-ink-100 px-5 py-4">
                <h3 id="iv-codes" className="text-sm font-semibold text-ink-900">
                  Impairment Codes
                </h3>
                <h4 className="mt-3 text-xs font-semibold text-ink-700">Primary Impairment Code</h4>
                <p className="mt-0.5 text-[13px] text-ink-900">{impairmentCodes.find((i) => i.code === r.primaryImpairmentCode)?.label}</p>
                <h4 className="mt-3 text-xs font-semibold text-ink-700">Secondary Impairment Codes</h4>
                <p className="mt-0.5 text-[13px] text-ink-500">
                  {r.secondaryImpairmentCodes.length ? r.secondaryImpairmentCodes.map((code) => impairmentCodes.find((i) => i.code === code)?.label).join('; ') : 'No Records'}
                </p>
              </section>
              <section aria-labelledby="iv-note" className="border-t border-ink-100 px-5 py-4">
                <h3 id="iv-note" className="text-sm font-semibold text-ink-900">
                  Underwriter Note
                </h3>
                <p className="mt-2 whitespace-pre-line text-[13px] leading-6 text-ink-900">{r.note.join('\n') || '—'}</p>
              </section>
            </> :

          <EmptyState
            icon={<ClipboardListIcon />}
            title="No rating activity yet"
            description="Calculate the rated age using the life expectancy table to create the first rating activity."
            action={
            <Button variant="primary" leadingIcon={<CirclePlusIcon />} onClick={() => navigate(`${base}/rating/edit`)}>
                  Add Rating Activity
                </Button>
            } />

          }
        </Panel>

        <section aria-label="RA confirmation and timeline" className="rounded-lg border border-ink-200 bg-white shadow-xs">
          <Tabs
            idPrefix="ra"
            label="Rating details"
            value={tab}
            onChange={setTab}
            className="px-3 pt-2"
            items={[
            { id: 'ra', label: 'RA Confirmation Sheet', icon: <FileTextIcon /> },
            { id: 'timeline', label: 'Timeline', icon: <HistoryIcon /> }]
            } />
          
          <div id={`ra-panel-${tab}`} role="tabpanel" aria-labelledby={`ra-tab-${tab}`} className="p-4">
            {tab === 'ra' ?
            <>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold text-ink-900">RA Confirmation Sheet</h3>
                  <IconButton label="Generate RA confirmation sheet" size="sm" className="text-brand-600" disabled={!r} onClick={() => navigate(`${base}/ra-sheet`)}>
                    <CirclePlusIcon />
                  </IconButton>
                </div>
                {r ?
              <div className="mt-3 rounded-md border border-ink-200 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`${base}/ra-sheet`} className="link inline-flex min-w-0 items-start gap-1.5 text-[13px]">
                        <FileTextIcon className="mt-0.5 h-4 w-4 shrink-0 text-danger-600" aria-hidden="true" />
                        <span className="break-all">{fileName}</span>
                      </Link>
                      <div className="flex shrink-0">
                        <IconButton label="Send RA to broker" size="sm" className="text-brand-700" onClick={() => navigate(`${base}/message`)}>
                          <ForwardIcon />
                        </IconButton>
                        <IconButton label={`Download ${fileName}`} size="sm" className="text-brand-700" onClick={() => {
                          downloadRASheet(c);
                          toast.success('RA sheet downloaded', { description: fileName });
                        }}>
                          <DownloadIcon />
                        </IconButton>
                      </div>
                    </div>
                    <dl className="mt-2 space-y-1 pl-5 text-[13px]">
                      <div className="flex gap-1.5">
                        <dt className="text-ink-500">Rated Age:</dt>
                        <dd className="font-semibold text-danger-600">{r.finalRatedAge}</dd>
                      </div>
                      <div className="flex gap-1.5">
                        <dt className="text-ink-500">Broker Firm:</dt>
                        <dd className="font-medium">{c.broker.firm}</dd>
                      </div>
                      <div className="flex gap-1.5">
                        <dt className="text-ink-500">Comment:</dt>
                        <dd>{c.raSheet?.comment || '—'}</dd>
                      </div>
                    </dl>
                    <p className="mt-2 pl-5 text-xs text-ink-500">
                      Created By {c.raSheet?.createdBy ?? c.underwriter.name} on {c.raSheet?.createdOn ?? r.dateEvaluated}
                    </p>
                  </div> :

              <p className="mt-3 text-[13px] text-ink-500">Available after the rating activity is saved.</p>
              }
              </> :

            <CaseTimeline events={c.timeline} onOpenLink={(e) => e.link?.endsWith('RASheet.pdf') ? navigate(`${base}/ra-sheet`) : toast(e.link ?? '')} />
            }
          </div>
        </section>
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete this rating activity?"
        description="The calculated and final rated age for this case will be removed. This can’t be undone."
        footer={
        <>
            <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button
            variant="primary"
            className="bg-danger-600 hover:bg-danger-700"
            leadingIcon={<Trash2Icon />}
            onClick={() => {
              saveRating(c.caseNumber, null);
              setConfirmDelete(false);
              toast.success('Rating activity deleted');
            }}>
            
              Delete
            </Button>
          </>
        } />
      
    </CaseLayout>);

}