import React, { useState } from 'react';
import { FileTextIcon, HistoryIcon, ReplyIcon, Trash2Icon } from 'lucide-react';
import { workQueue } from '../../data/workQueue';
import { QueueItem } from '../../types/workspace';
import { FlagIndicator } from '../case/FlagIndicator';
import { StatusBadge } from '../case/StatusBadge';
import { Column, DataTable } from '../DataTable';
import { Alert } from '../ui/Alert';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Panel } from '../ui/Panel';
import { Tabs } from '../ui/Tabs';
import { DemoLabel, DocSection } from './DocSection';

const columns: Column<QueueItem>[] = [
{ key: 'rush', header: 'Rush', sortValue: (r) => r.rush ? 1 : 0, render: (r) => <FlagIndicator kind="rush" active={r.rush} /> },
{ key: 'rework', header: 'Rework', sortValue: (r) => r.rework ? 1 : 0, render: (r) => <FlagIndicator kind="rework" active={r.rework} /> },
{ key: 'case', header: 'Case #', sortValue: (r) => r.caseNumber, render: (r) => r.caseNumber },
{ key: 'claimant', header: 'Claimant', sortValue: (r) => r.claimant, render: (r) => <span className="font-medium text-brand-700">{r.claimant}</span> },
{ key: 'status', header: 'Status', sortValue: (r) => r.status, render: (r) => <StatusBadge status={r.status} /> }];


export function DisplaySection() {
  const [tab, setTab] = useState('ra');
  const [modal, setModal] = useState(false);

  return (
    <>
      <DocSection id="tables" title="Data tables" description="One component covers all 10+ grids in the app. It keeps the original Show entries control, export tools, search, sortable columns, the “Showing X to Y of Z entries” footer and pagination.">
        <Panel title="My Underwriter Work Queue (sample)" bodyClassName="p-0">
          <DataTable id="ds-table" label="Sample work queue" columns={columns} rows={workQueue} defaultPageSize={5} getRowId={(r) => r.id} getSearchText={(r) => `${r.caseNumber} ${r.claimant} ${r.status}`} />
        </Panel>
        <ul className="mt-3 grid gap-x-6 gap-y-1 text-[13px] text-ink-700 sm:grid-cols-2">
          <li>• 12px semibold headers on ink-50, with a sort affordance on every sortable column</li>
          <li>• 13px cells, 10px vertical padding, hairline row dividers</li>
          <li>• Row hover uses brand-50 because rows hold primary links</li>
          <li>• Empty state reads “No Records Found”, as in the original</li>
        </ul>
      </DocSection>

      <DocSection id="badges" title="Badges & status indicators">
        <div className="grid gap-5 rounded-lg border border-ink-200 bg-white p-5 md:grid-cols-3">
          <div>
            <DemoLabel>Case status</DemoLabel>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="Ready for UW" />
              <StatusBadge status="Rated*" />
              <StatusBadge status="CS Communicated" />
            </div>
          </div>
          <div>
            <DemoLabel>Tones</DemoLabel>
            <div className="flex flex-wrap gap-2">
              <Badge>Neutral</Badge>
              <Badge tone="info" icon={<ReplyIcon aria-hidden="true" />}>Replied</Badge>
              <Badge tone="success">Success</Badge>
              <Badge tone="warning">Warning</Badge>
              <Badge tone="danger">Error</Badge>
            </div>
          </div>
          <div>
            <DemoLabel>Flags (column-labeled, SR text)</DemoLabel>
            <div className="flex items-center gap-4 text-[13px]">
              <span className="inline-flex items-center gap-1.5"><FlagIndicator kind="rush" active /> Rush</span>
              <span className="inline-flex items-center gap-1.5"><FlagIndicator kind="rework" active /> Rework</span>
            </div>
          </div>
        </div>
      </DocSection>

      <DocSection id="alerts" title="Alerts & feedback" description="Inline alerts handle validation and form-level messages. Toasts confirm completed actions and offer Undo for reversible ones.">
        <div className="grid gap-3 md:grid-cols-2">
          <Alert tone="info">No existing claimant matches. Create a new claimant to continue.</Alert>
          <Alert tone="success" title="Rating activity saved">SHEILA STUART · Final Rated Age 65</Alert>
          <Alert tone="warning">Calculate the rated age before saving.</Alert>
          <Alert tone="danger" title="Please fix 2 fields before saving.">Required fields are marked with an asterisk.</Alert>
        </div>
      </DocSection>

      <DocSection id="cards" title="Cards, panels & tabs">
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="Rating Activity" actions={<Badge tone="warning" dot>Rated*</Badge>}>
            <div className="flex items-center gap-4">
              <Avatar initials="SA" tone="warning" size="lg" />
              <dl className="grid flex-1 grid-cols-3 gap-4">
                <div>
                  <dt className="text-xs font-medium text-ink-500">Normal L.E.</dt>
                  <dd className="text-2xl font-semibold tabular-nums text-brand-700">20.72</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-ink-500">Estimated L.E.</dt>
                  <dd className="text-2xl font-semibold tabular-nums text-warning-700">20.72</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-ink-500">Final Rated Age</dt>
                  <dd className="text-2xl font-semibold tabular-nums text-danger-600">65</dd>
                </div>
              </dl>
            </div>
          </Panel>
          <div className="rounded-lg border border-ink-200 bg-white shadow-xs">
            <Tabs
              idPrefix="ds-tabs"
              label="Tabs example"
              value={tab}
              onChange={setTab}
              className="px-3 pt-2"
              items={[
              { id: 'ra', label: 'RA Confirmation Sheet', icon: <FileTextIcon /> },
              { id: 'timeline', label: 'Timeline', icon: <HistoryIcon /> }]
              } />
            
            <div id={`ds-tabs-panel-${tab}`} role="tabpanel" aria-labelledby={`ds-tabs-tab-${tab}`} className="p-4 text-[13px] text-ink-700">
              {tab === 'ra' ? 'Underline tabs: brand-600 indicator, keyboard arrows, Home and End.' : 'Each tab panel is linked to its tab with aria-controls and aria-labelledby.'}
            </div>
          </div>
        </div>
      </DocSection>

      <DocSection id="modals" title="Modals" description="Used only for destructive confirmation and short single-field tasks. The dialog enters from scale 0.96 over 200ms, traps focus and closes on Esc.">
        <div className="flex flex-wrap gap-2">
          <Button variant="danger" leadingIcon={<Trash2Icon />} onClick={() => setModal(true)}>
            Open confirmation dialog
          </Button>
        </div>
        <Modal
          open={modal}
          onClose={() => setModal(false)}
          title="Move this email to trash?"
          description="“Jon Eldridge” from KELSEY TAYLOR will be removed from the SS Medicals Inbox."
          footer={
          <>
              <Button onClick={() => setModal(false)}>Cancel</Button>
              <Button variant="primary" className="bg-danger-600 hover:bg-danger-700" onClick={() => setModal(false)}>
                Move to Trash
              </Button>
            </>
          } />
        
      </DocSection>
    </>);

}