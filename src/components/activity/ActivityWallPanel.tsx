import React, { useState } from 'react';
import { ChevronDownIcon, FilterIcon, HeartPulseIcon, MailIcon, MessageSquareIcon, MessageSquarePlusIcon, PaperclipIcon, PlusIcon, RefreshCwIcon, SearchIcon, StickyNoteIcon } from 'lucide-react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { WallEntry } from '../../types/case';
import { IconButton } from '../ui/IconButton';
import { TextInput } from '../ui/TextInput';
import { ColumnPanel } from './ColumnPanel';

interface ActivityWallPanelProps {
  entries: WallEntry[];
  onAddMessage: () => void;
  onOpen: (entry: WallEntry) => void;
}

export function ActivityWallPanel({ entries, onAddMessage, onOpen }: ActivityWallPanelProps) {
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [monthOpen, setMonthOpen] = useState(true);
  const q = query.trim().toLowerCase();
  const visible = q ? entries.filter((e) => `${e.subject} ${e.by} ${e.label}`.toLowerCase().includes(q)) : entries;

  return (
    <ColumnPanel
      title="Activity Wall"
      tone="brand"
      icon={<MessageSquareIcon />}
      actions={
      <>
          <IconButton label="Add message" size="sm" onClick={onAddMessage}>
            <PlusIcon />
          </IconButton>
          <IconButton label="Add comment" size="sm" onClick={onAddMessage}>
            <MessageSquarePlusIcon />
          </IconButton>
          <IconButton label="Filter" size="sm" onClick={() => toast('Filters aren’t part of this prototype.')}>
            <FilterIcon />
          </IconButton>
          <IconButton label="Refresh" size="sm" onClick={() => toast.success('Activity Wall is up to date')}>
            <RefreshCwIcon />
          </IconButton>
          <IconButton label={searching ? 'Close search' : 'Search activity'} aria-expanded={searching} size="sm" onClick={() => setSearching((s) => !s)}>
            <SearchIcon />
          </IconButton>
        </>
      }>
      
      {searching &&
      <div className="mb-4">
          <TextInput inputSize="sm" type="search" autoFocus aria-label="Search Activity Wall" placeholder="Search activity" leadingIcon={<SearchIcon />} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      }

      <div className="flex justify-center">
        <button
          type="button"
          aria-expanded={monthOpen}
          onClick={() => setMonthOpen((o) => !o)}
          className="focus-ring inline-flex items-center gap-1 rounded-full bg-success-700 px-3 py-1 text-xs font-semibold text-white transition-colors duration-150 hover:bg-success-600">
          
          <ChevronDownIcon className={twMerge('h-3.5 w-3.5 transition-transform duration-150', !monthOpen && '-rotate-90')} aria-hidden="true" />
          April 2026
        </button>
      </div>

      {monthOpen && (
      visible.length ?
      <ol className="relative mt-4 space-y-4 before:absolute before:bottom-3 before:left-[15px] before:top-3 before:w-px before:bg-ink-200">
            {visible.map((e) =>
        <li key={e.id} className="relative flex gap-3">
                <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink-200 bg-white">
                  {e.kind === 'email' ? <MailIcon className="h-4 w-4 text-warning-600" aria-hidden="true" /> : <StickyNoteIcon className="h-4 w-4 text-brand-600" aria-hidden="true" />}
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-[13px] text-ink-700">
                    {e.label} <span className="font-medium text-success-700">{e.at}</span>
                  </p>
                  <button type="button" onClick={() => onOpen(e)} className="link text-left text-[13px]">
                    {e.subject}
                  </button>
                  <p className="text-xs text-ink-500">by {e.by}</p>
                </div>
                <span className="pt-1" title={e.kind === 'email' ? '1 attachment' : 'Medical note'}>
                  {e.kind === 'email' ?
            <span className="inline-flex items-center gap-0.5 text-xs font-medium text-ink-700">
                      <PaperclipIcon className="h-4 w-4 text-brand-600" aria-hidden="true" />1<span className="sr-only"> attachment</span>
                    </span> :

            <>
                      <HeartPulseIcon className="h-4 w-4 text-danger-600" aria-hidden="true" />
                      <span className="sr-only">Medical note</span>
                    </>
            }
                </span>
              </li>
        )}
          </ol> :

      <p className="py-6 text-center text-[13px] text-ink-500">No Records Found</p>)
      }
    </ColumnPanel>);

}