import React from 'react';
import { BellIcon, ChartLineIcon, ChevronDownIcon, HourglassIcon, HouseIcon, LogOutIcon, MinusIcon, RefreshCwIcon, UserIcon, XIcon } from 'lucide-react';
import { CaseToolbar } from '../case/CaseToolbar';
import { StatusBadge } from '../case/StatusBadge';
import { DemoLabel, DocSection } from './DocSection';

export function NavigationSection() {
  return (
    <DocSection id="navigation" title="Navigation" description="The original two-tier blue header and per-record window bar are kept. Tone and spacing are refined, and every icon has a label.">
      <div className="space-y-5">
        <div>
          <DemoLabel>Application header — brand-600 primary bar + brand-700 workspace bar</DemoLabel>
          <div className="overflow-hidden rounded-lg border border-ink-200" aria-hidden="true">
            <div className="flex h-12 items-center gap-3 bg-brand-600 px-3 text-sm font-medium text-white">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-white/15"><HourglassIcon className="h-4 w-4" /></span>
              <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1">Address Book <ChevronDownIcon className="h-4 w-4" /></span>
              <span>Documents</span>
              <span>Calendar</span>
              <span>Tools</span>
              <span className="mx-auto hidden h-8 w-72 rounded-md bg-white md:block" />
              <ChartLineIcon className="h-4 w-4" />
              <span className="inline-flex items-center gap-1.5"><UserIcon className="h-4 w-4" /> Lauren McKenna</span>
              <LogOutIcon className="h-4 w-4" />
            </div>
            <div className="flex h-10 items-center justify-between bg-brand-700 px-3 text-sm font-medium text-white">
              <span className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-white/15 px-2.5 py-1"><HouseIcon className="h-4 w-4" /> Home Workspace</span>
                <span className="text-white/90">Reports</span>
              </span>
              <BellIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
        <div>
          <DemoLabel>Window bar + case header (record views)</DemoLabel>
          <div className="overflow-hidden rounded-lg border border-ink-200 bg-white">
            <div className="flex h-11 items-center justify-between border-b border-ink-200 px-4" aria-hidden="true">
              <p className="text-[15px] font-semibold text-brand-800">SHEILA STUART (26-01867)</p>
              <span className="flex gap-2 text-ink-500">
                <RefreshCwIcon className="h-4 w-4" />
                <MinusIcon className="h-4 w-4" />
                <XIcon className="h-4 w-4 text-danger-600" />
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5">
              <p className="text-lg font-semibold text-ink-900">Rating Activity for SHEILA STUART</p>
              <div className="flex items-center gap-3">
                <StatusBadge status="Rated*" />
                <CaseToolbar caseId="26-01867" />
              </div>
            </div>
          </div>
          <p className="mt-2 text-[13px] text-ink-500">The case toolbar is live. Use it to jump between the case’s Activity Sheets, Rating Activity, RA sheet and messaging screens.</p>
        </div>
      </div>
    </DocSection>);

}