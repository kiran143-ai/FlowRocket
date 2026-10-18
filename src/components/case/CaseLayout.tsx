import React from 'react';
import { FileTextIcon } from 'lucide-react';
import { CaseRecord } from '../../types/case';
import { WindowBar } from '../layout/WindowBar';
import { CaseToolbar } from './CaseToolbar';
import { StatusBadge } from './StatusBadge';

interface CaseLayoutProps {
  caseRecord: CaseRecord;
  title: string;
  hideTitle?: boolean;
  titleAction?: React.ReactNode;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
}

export function CaseLayout({ caseRecord, title, hideTitle = false, titleAction, headerExtra, children }: CaseLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-88px)] flex-col">
      <WindowBar title={`${caseRecord.claimantName} (${caseRecord.caseNumber})`} icon={<FileTextIcon />} />
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-200 bg-white px-4 py-2.5 lg:px-6">
        <div className="flex min-w-0 items-center gap-1.5">
          <h1 className={hideTitle ? 'sr-only' : 'truncate text-lg font-semibold text-ink-900'}>{title}</h1>
          {titleAction}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-3">
          {headerExtra}
          <StatusBadge status={caseRecord.status} />
          <CaseToolbar caseId={caseRecord.caseNumber} />
        </div>
      </div>
      <div className="flex-1 p-4 lg:p-6">{children}</div>
    </div>);

}