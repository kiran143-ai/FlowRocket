import React, { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChartLineIcon, ChevronRightIcon, ClipboardCheckIcon, FlagIcon, InboxIcon, MailIcon, ReplyIcon, SendIcon, StethoscopeIcon, Trash2Icon, XIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { toast } from 'sonner';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useAllCases } from '../hooks/useCase';
import { returnEmailReceipts } from '../data/returnEmailReceipts';
import { secondaryReviewItems } from '../data/secondaryReview';
import { Column, DataTable } from '../components/DataTable';
import { FlagIndicator } from '../components/case/FlagIndicator';
import { StatusBadge } from '../components/case/StatusBadge';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { Modal } from '../components/ui/Modal';
import { Panel } from '../components/ui/Panel';
import { StatCard } from '../components/ui/StatCard';
import { CaseStatus, InboxItem, QueueItem, ReturnEmailItem, SecondaryReviewItem } from '../types/workspace';

type QueueFilter = 'all' | CaseStatus | 'flagged';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

const dateSort = (v: string): number => {
  const m = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}) (AM|PM)/.exec(v);
  if (!m) return 0;
  const hours = Number(m[4]) % 12 + (m[6] === 'PM' ? 12 : 0);
  return new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]), hours, Number(m[5])).getTime();
};

function Sender({ value }: {value: string;}) {
  const [name, email] = value.split(' (');
  return (
    <span>
      <span className="font-medium text-ink-900">{name}</span>
      {email && <span className="text-ink-500"> ({email}</span>}
    </span>);

}

export function Dashboard() {
  const { queue, inbox, trashInbox, restoreInbox } = useWorkspace();
  const location = useLocation();
  const highlight = (location.state as {highlight?: string;} | null)?.highlight;
  const [pendingTrash, setPendingTrash] = useState<InboxItem | null>(null);
  const [filter, setFilter] = useState<QueueFilter>('all');
  const navigate = useNavigate();
  const allCases = useAllCases();
  const queueRef = useRef<HTMLDivElement>(null);
  const inboxRef = useRef<HTMLDivElement>(null);

  const count = (f: QueueFilter) => f === 'all' ? queue.length : f === 'flagged' ? queue.filter((q) => q.rush || q.rework).length : queue.filter((q) => q.status === f).length;
  const filteredQueue = filter === 'all' ? queue : queue.filter((q) => filter === 'flagged' ? q.rush || q.rework : q.status === filter);
  const unreplied = inbox.filter((i) => !i.replied).length;
  const communicated = allCases.filter((c) => c.status === 'CS Communicated').length;

  const scrollTo = (el: HTMLElement | null) => el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const showQueue = (f: QueueFilter) => {
    setFilter((cur) => cur === f ? 'all' : f);
    scrollTo(queueRef.current);
  };

  const filters: {id: QueueFilter;label: string;}[] = [
  { id: 'all', label: 'All' },
  { id: 'Ready for UW', label: 'Ready for UW' },
  { id: 'Rated*', label: 'Rated, not sent' },
  { id: 'flagged', label: 'Rush / Rework' }];


  const confirmTrash = () => {
    if (!pendingTrash) return;
    const item = pendingTrash;
    const index = inbox.findIndex((i) => i.id === item.id);
    trashInbox(item.id);
    setPendingTrash(null);
    toast('Email moved to trash', { description: item.subject, action: { label: 'Undo', onClick: () => restoreInbox(item, index) } });
  };

  const queueColumns: Column<QueueItem>[] = [
  { key: 'rush', header: 'Rush', className: 'w-16', sortValue: (r) => r.rush ? 1 : 0, render: (r) => <FlagIndicator kind="rush" active={r.rush} /> },
  { key: 'rework', header: 'Rework', className: 'w-20', sortValue: (r) => r.rework ? 1 : 0, render: (r) => <FlagIndicator kind="rework" active={r.rework} /> },
  { key: 'case', header: 'Case #', sortValue: (r) => r.caseNumber, render: (r) => <span className="tabular-nums">{r.caseNumber}</span> },
  {
    key: 'claimant',
    header: 'Claimant',
    sortValue: (r) => r.claimant,
    render: (r) =>
    <Link to={`/case/${r.caseNumber}`} className="link whitespace-nowrap">
          {r.claimant}
        </Link>

  },
  { key: 'dob', header: 'DOB', sortValue: (r) => r.dob, render: (r) => <span className="tabular-nums">{r.dob}</span> },
  { key: 'received', header: 'Date Received', sortValue: (r) => dateSort(r.dateReceived), render: (r) => <span className="whitespace-nowrap tabular-nums">{r.dateReceived}</span> },
  { key: 'sender', header: 'Sender', sortValue: (r) => r.sender, render: (r) => <Sender value={r.sender} /> },
  { key: 'status', header: 'Status', sortValue: (r) => r.status, render: (r) => <StatusBadge status={r.status} /> }];


  const inboxColumns: Column<InboxItem>[] = [
  {
    key: 'replied',
    header: 'Replied',
    hideHeaderLabel: true,
    className: 'w-10',
    render: (r) =>
    r.replied ?
    <span title="Replied" className="text-brand-600">
            <ReplyIcon className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Replied</span>
          </span> :

    <span className="sr-only">Not replied</span>

  },
  { key: 'from', header: 'From', sortValue: (r) => r.fromName, render: (r) => <Sender value={`${r.fromName} (${r.fromEmail})`} /> },
  {
    key: 'subject',
    header: 'Subject',
    sortValue: (r) => r.subject,
    render: (r) =>
    <Link to={`/email/${r.id}`} className="link">
          {r.subject}
        </Link>

  },
  { key: 'received', header: 'Received On', sortValue: (r) => dateSort(r.receivedOn), render: (r) => <span className="whitespace-nowrap tabular-nums">{r.receivedOn}</span> },
  { key: 'status', header: 'Status', render: (r) => r.status ? r.status : <span className="text-ink-400" aria-label="No status">—</span> },
  {
    key: 'trash',
    header: 'Trash',
    className: 'w-16 text-center',
    render: (r) =>
    <IconButton label={`Move “${r.subject}” to trash`} variant="danger" size="sm" onClick={() => setPendingTrash(r)}>
          <Trash2Icon />
        </IconButton>

  }];


  const secondaryColumns: Column<SecondaryReviewItem>[] = [
  { key: 'rush', header: 'Rush', sortValue: (r) => r.rush ? 1 : 0, render: (r) => <FlagIndicator kind="rush" active={r.rush} /> },
  { key: 'rework', header: 'Rework', sortValue: (r) => r.rework ? 1 : 0, render: (r) => <FlagIndicator kind="rework" active={r.rework} /> },
  { key: 'case', header: 'Case #', sortValue: (r) => r.caseNumber, render: (r) => r.caseNumber },
  { key: 'claimant', header: 'Claimant', sortValue: (r) => r.claimant, render: (r) => r.claimant },
  { key: 'received', header: 'Date Received', sortValue: (r) => r.dateReceived, render: (r) => r.dateReceived },
  { key: 'sender', header: 'Sender', sortValue: (r) => r.sender, render: (r) => r.sender },
  { key: 'underwriter', header: 'Underwriter', sortValue: (r) => r.underwriter, render: (r) => r.underwriter }];


  const returnColumns: Column<ReturnEmailItem>[] = [
  { key: 'from', header: 'From', sortValue: (r) => r.from, render: (r) => r.from },
  { key: 'subject', header: 'Subject', sortValue: (r) => r.subject, render: (r) => r.subject },
  { key: 'received', header: 'Received On', sortValue: (r) => r.receivedOn, render: (r) => r.receivedOn },
  { key: 'actions', header: 'Actions', hideHeaderLabel: true, render: () => null }];


  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 lg:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-ink-900">{greeting()}, Lauren</h1>
          <p className="mt-0.5 text-sm text-ink-500">Here’s where your rated-age requests stand, from first email to broker confirmation.</p>
        </div>
        <Button size="sm" leadingIcon={<ChartLineIcon />} onClick={() => navigate('/reports')}>
          View reports
        </Button>
      </div>

      <section aria-labelledby="pipeline-heading">
        <h2 id="pipeline-heading" className="sr-only">
          Case pipeline
        </h2>
        <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
          {
            eyebrow: 'Step 1 · Intake',
            label: 'New broker emails',
            value: unreplied,
            icon: <InboxIcon />,
            tone: 'neutral' as const,
            hint: 'Requests in the SS Medicals inbox you haven’t replied to yet.',
            action: 'Review inbox',
            onClick: () => scrollTo(inboxRef.current)
          },
          {
            eyebrow: 'Step 2 · Underwrite',
            label: 'Ready for underwriting',
            value: count('Ready for UW'),
            icon: <StethoscopeIcon />,
            tone: 'brand' as const,
            hint: 'Cases waiting for a rated age from the life expectancy table.',
            action: filter === 'Ready for UW' ? 'Showing below · clear' : 'Show cases',
            onClick: () => showQueue('Ready for UW'),
            active: filter === 'Ready for UW'
          },
          {
            eyebrow: 'Step 3 · Confirm',
            label: 'Rated, not yet sent',
            value: count('Rated*'),
            icon: <ClipboardCheckIcon />,
            tone: 'warning' as const,
            hint: 'RA confirmation sheet is ready — send it to the broker.',
            action: filter === 'Rated*' ? 'Showing below · clear' : 'Show cases',
            onClick: () => showQueue('Rated*'),
            active: filter === 'Rated*'
          },
          {
            eyebrow: 'Step 4 · Done',
            label: 'Sent to broker',
            value: communicated,
            icon: <SendIcon />,
            tone: 'success' as const,
            hint: 'RA confirmations delivered. Download or resend from Reports.',
            action: 'Open reports',
            onClick: () => navigate('/reports')
          }].
          map(({ eyebrow, ...card }, i, arr) =>
          <li key={eyebrow} className="relative">
              <StatCard eyebrow={eyebrow} {...card} />
              {i < arr.length - 1 &&
            <ChevronRightIcon className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 rounded-full border border-ink-200 bg-white p-1 text-ink-400 xl:block" aria-hidden="true" />
            }
            </li>
          )}
        </ol>
        {count('flagged') > 0 &&
        <button
          type="button"
          onClick={() => showQueue('flagged')}
          className="focus-ring mt-3 inline-flex items-center gap-2 rounded-md bg-warning-50 px-3 py-2 text-[13px] text-warning-700 ring-1 ring-inset ring-warning-100 hover:bg-warning-100">
          
            <FlagIcon className="h-4 w-4" aria-hidden="true" />
            <span>
              <span className="font-semibold">{count('flagged')} cases flagged for rush or rework</span> — review these first.
            </span>
          </button>
        }
      </section>

      <div ref={queueRef} className="scroll-mt-28">
        <Panel
          title="My Underwriter Work Queue"
          bodyClassName="p-0"
          actions={
          <div role="group" aria-label="Filter work queue" className="flex flex-wrap items-center gap-1">
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
                  <span className={twMerge('tabular-nums', filter === f.id ? 'text-white/80' : 'text-ink-500')}>{count(f.id)}</span>
                </button>
            )}
              {filter !== 'all' &&
            <IconButton label="Clear filter" size="sm" onClick={() => setFilter('all')}>
                  <XIcon />
                </IconButton>
            }
            </div>
          }>
          
          <DataTable
            id="work-queue"
            label="My Underwriter Work Queue"
            columns={queueColumns}
            rows={filteredQueue}
            getRowId={(r) => r.id}
            getSearchText={(r) => `${r.caseNumber} ${r.claimant} ${r.dob} ${r.dateReceived} ${r.sender} ${r.status}`}
            rowClassName={(r) => r.id === highlight ? 'bg-success-50' : undefined}
            emptyMessage="No cases match this filter." />
          
        </Panel>
      </div>

      <div ref={inboxRef} className="scroll-mt-28">
      <Panel title="SS Medicals Inbox" icon={<MailIcon />} bodyClassName="p-0">
        <DataTable
          id="ss-medicals-inbox"
          label="SS Medicals Inbox"
          columns={inboxColumns}
          rows={inbox}
          getRowId={(r) => r.id}
          getSearchText={(r) => `${r.fromName} ${r.fromEmail} ${r.subject} ${r.receivedOn}`} />
        
      </Panel>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-2">

      <Panel title="Secondary Review" bodyClassName="p-0">
        <DataTable
          id="secondary-review"
          label="Secondary Review"
          columns={secondaryColumns}
          rows={secondaryReviewItems}
          getRowId={(r) => r.id}
          getSearchText={(r) => `${r.caseNumber} ${r.claimant} ${r.sender} ${r.underwriter}`} />
        
      </Panel>

      <Panel title="Return Email Receipt" bodyClassName="p-0">
        <DataTable
          id="return-email-receipt"
          label="Return Email Receipt"
          columns={returnColumns}
          rows={returnEmailReceipts}
          defaultPageSize={5}
          getRowId={(r) => r.id}
          getSearchText={(r) => `${r.from} ${r.subject} ${r.receivedOn}`} />
        
      </Panel>
      </div>

      <Modal
        open={!!pendingTrash}
        onClose={() => setPendingTrash(null)}
        title="Move this email to trash?"
        description={
        pendingTrash &&
        <>
              <span className="font-medium text-ink-900">{pendingTrash.subject}</span> from {pendingTrash.fromName} will be removed from the SS Medicals Inbox.
            </>

        }
        footer={
        <>
            <Button onClick={() => setPendingTrash(null)}>Cancel</Button>
            <Button variant="primary" className="bg-danger-600 hover:bg-danger-700 active:bg-danger-700" leadingIcon={<Trash2Icon />} onClick={confirmTrash}>
              Move to Trash
            </Button>
          </>
        } />
      
    </div>);

}