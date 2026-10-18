import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FileXIcon, HistoryIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useCase } from '../hooks/useCase';
import { ActivityWallPanel } from '../components/activity/ActivityWallPanel';
import { CaseOverview } from '../components/activity/CaseOverview';
import { ColumnPanel } from '../components/activity/ColumnPanel';
import { SummaryPanel } from '../components/activity/SummaryPanel';
import { CaseLayout } from '../components/case/CaseLayout';
import { CaseTimeline } from '../components/case/CaseTimeline';
import { EmptyState } from '../components/layout/EmptyState';

export function ActivitySheet() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const c = useCase(caseId);

  if (!c) return <EmptyState icon={<FileXIcon />} title="Case not found" action={<Link to="/" className="link text-sm">Back to Home Workspace</Link>} />;

  const base = `/case/${c.caseNumber}`;

  return (
    <CaseLayout caseRecord={c} title={`Activity Sheets Dashboard — ${c.claimantName}`} hideTitle>
      <CaseOverview caseRecord={c} />
      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)] xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.1fr)_minmax(0,1fr)]">
        <ColumnPanel title="Timeline" tone="success" icon={<HistoryIcon />}>
          <CaseTimeline events={c.timeline} onOpenLink={(e) => e.link?.endsWith('RASheet.pdf') ? navigate(`${base}/ra-sheet`) : e.kind === 'note' ? navigate(`${base}/message`) : toast(e.link ?? '')} />
        </ColumnPanel>
        <SummaryPanel caseRecord={c} />
        <div className="lg:col-span-2 xl:col-span-1">
          <ActivityWallPanel entries={c.wall} onAddMessage={() => navigate(`${base}/message`)} onOpen={(e) => navigate(e.kind === 'email' ? `${base}/message` : `${base}/rating`)} />
        </div>
      </div>
    </CaseLayout>);

}