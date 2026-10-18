import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClipboardCheckIcon, DownloadIcon, EyeIcon, FileTextIcon, HourglassIcon, SendIcon, TrendingUpIcon } from 'lucide-react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { useAllCases } from '../hooks/useCase';
import { Column, DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/case/StatusBadge';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { Panel } from '../components/ui/Panel';
import { StatCard } from '../components/ui/StatCard';
import { CaseRecord } from '../types/case';
import { parseUSDate } from '../utils/date';
import { raFileName } from '../utils/raSheet';
import { downloadRASheet } from '../utils/raSheetPdf';

type ReportFilter = 'all' | 'pending' | 'sent';

const dateSort = (v: string) => parseUSDate(v)?.getTime() ?? 0;

export function Reports() {
  const navigate = useNavigate();
  const all = useAllCases();
  const [filter, setFilter] = useState<ReportFilter>('all');

  const rated = all.filter((c) => c.rating);
  const inUnderwriting = all.length - rated.length;
  const sent = rated.filter((c) => c.status === 'CS Communicated');
  const pending = rated.filter((c) => c.status !== 'CS Communicated');
  const rows = filter === 'all' ? rated : filter === 'sent' ? sent : pending;
  const avgUp = rated.length ? rated.reduce((s, c) => s + (c.rating!.finalRatedAge - c.rating!.age), 0) / rated.length : 0;

  const byBroker = Object.entries(
    rated.reduce<Record<string, number>>((acc, c) => ({ ...acc, [c.broker.firm]: (acc[c.broker.firm] ?? 0) + 1 }), {})
  ).sort((a, b) => b[1] - a[1]);
  const maxBroker = Math.max(1, ...byBroker.map(([, n]) => n));

  const download = (c: CaseRecord) => {
    downloadRASheet(c);
    toast.success('RA sheet downloaded', { description: raFileName(c) });
  };

  const columns: Column<CaseRecord>[] = [
  {
    key: 'claimant',
    header: 'Claimant',
    sortValue: (c) => c.claimantName,
    render: (c) =>
    <div className="min-w-[150px]">
          <Link to={`/case/${c.caseNumber}`} className="link">
            {c.claimantName}
          </Link>
          <p className="text-xs tabular-nums text-ink-500">Case # {c.caseNumber}</p>
        </div>

  },
  {
    key: 'broker',
    header: 'Broker',
    sortValue: (c) => c.broker.firm,
    render: (c) =>
    <div className="min-w-[160px]">
          <p className="font-medium text-ink-900">{c.broker.firm}</p>
          <p className="text-xs text-ink-500">
            {c.broker.contact} · {c.broker.city}
          </p>
        </div>

  },
  {
    key: 'rated',
    header: 'Rated age',
    sortValue: (c) => c.rating!.finalRatedAge,
    render: (c) =>
    <span className="whitespace-nowrap">
          <span className="text-base font-semibold tabular-nums text-ink-900">{c.rating!.finalRatedAge}</span>
          <span className="ml-1.5 text-xs tabular-nums text-ink-500">
            age {c.rating!.age}, +{c.rating!.finalRatedAge - c.rating!.age}
          </span>
        </span>

  },
  { key: 'evaluated', header: 'Evaluated', sortValue: (c) => dateSort(c.rating!.dateEvaluated), render: (c) => <span className="tabular-nums">{c.rating!.dateEvaluated}</span> },
  { key: 'valid', header: 'Valid through', sortValue: (c) => dateSort(c.rating!.expirationDate), render: (c) => <span className="tabular-nums">{c.rating!.expirationDate}</span> },
  { key: 'status', header: 'Status', sortValue: (c) => c.status, render: (c) => <StatusBadge status={c.status} /> },
  {
    key: 'actions',
    header: 'Actions',
    className: 'text-right',
    render: (c) =>
    <div className="flex items-center justify-end gap-0.5">
          <IconButton label={`Preview RA sheet for ${c.claimantName}`} size="sm" onClick={() => navigate(`/case/${c.caseNumber}/ra-sheet`)}>
            <EyeIcon />
          </IconButton>
          <IconButton label={`Download ${raFileName(c)}`} size="sm" onClick={() => download(c)}>
            <DownloadIcon />
          </IconButton>
          <Button size="sm" variant={c.status === 'CS Communicated' ? 'ghost' : 'primary'} leadingIcon={<SendIcon />} className="ml-1" onClick={() => navigate(`/case/${c.caseNumber}/message`)}>
            {c.status === 'CS Communicated' ? 'Resend' : 'Send'}
          </Button>
        </div>

  }];


  const filters: {id: ReportFilter;label: string;n: number;}[] = [
  { id: 'all', label: 'All', n: rated.length },
  { id: 'pending', label: 'Not sent yet', n: pending.length },
  { id: 'sent', label: 'Sent to broker', n: sent.length }];


  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">Reports</h1>
        <p className="mt-0.5 text-sm text-ink-500">Every RA confirmation sheet in one place — preview, download the PDF, or send it to the broker.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="RA sheets issued" value={rated.length} icon={<FileTextIcon />} tone="brand" hint={`${inUnderwriting} more ${inUnderwriting === 1 ? 'case is' : 'cases are'} still in underwriting`} />
        <StatCard
          label="Not sent to broker yet"
          value={pending.length}
          icon={<HourglassIcon />}
          tone="warning"
          hint="Rated, but the confirmation hasn’t gone out"
          action={filter === 'pending' ? 'Showing below · clear' : 'Show these'}
          active={filter === 'pending'}
          onClick={() => setFilter((f) => f === 'pending' ? 'all' : 'pending')} />

        <StatCard
          label="Sent to broker"
          value={sent.length}
          icon={<ClipboardCheckIcon />}
          tone="success"
          hint="Confirmations delivered by email"
          action={filter === 'sent' ? 'Showing below · clear' : 'Show these'}
          active={filter === 'sent'}
          onClick={() => setFilter((f) => f === 'sent' ? 'all' : 'sent')} />

        <StatCard label="Avg. years rated up" value={`+${avgUp.toFixed(1)}`} icon={<TrendingUpIcon />} tone="neutral" hint="Final rated age minus actual age" />
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Panel
          title="RA Confirmation Sheets"
          icon={<FileTextIcon />}
          bodyClassName="p-0"
          actions={
          <div role="group" aria-label="Filter RA sheets" className="flex flex-wrap gap-1">
              {filters.map((f) =>
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={twMerge(
                'focus-ring inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors duration-150',
                filter === f.id ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
              )}>

                  {f.label}
                  <span className={twMerge('tabular-nums', filter === f.id ? 'text-white/80' : 'text-ink-500')}>{f.n}</span>
                </button>
            )}
            </div>
          }>

          <DataTable
            id="ra-reports"
            label="RA Confirmation Sheets"
            columns={columns}
            rows={rows}
            defaultPageSize={10}
            getRowId={(c) => c.caseNumber}
            getSearchText={(c) => `${c.caseNumber} ${c.claimantName} ${c.broker.firm} ${c.broker.contact} ${c.status}`}
            emptyMessage="No RA sheets match this filter." />

        </Panel>

        <Panel title="RA sheets by broker firm">
          <ul className="space-y-3">
            {byBroker.map(([firm, n]) =>
            <li key={firm} title={`${firm}: ${n} RA ${n === 1 ? 'sheet' : 'sheets'}`}>
                <div className="flex items-baseline justify-between gap-3 text-[13px]">
                  <span className="truncate text-ink-700">{firm}</span>
                  <span className="font-semibold tabular-nums text-ink-900">{n}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-ink-100" aria-hidden="true">
                  <div className="h-2 rounded-full bg-brand-500" style={{ width: `${n / maxBroker * 100}%` }} />
                </div>
              </li>
            )}
          </ul>
          <p className="mt-4 border-t border-ink-100 pt-3 text-xs text-ink-500">Counts every case with a saved rating, sent or not.</p>
        </Panel>
      </div>
    </div>);

}
