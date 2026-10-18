import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ClipboardListIcon, FolderIcon, HeartPulseIcon, HouseIcon, MessageSquareIcon, UsersIcon, type LucideIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
interface ToolbarItem {
  path: string;
  label: string;
  icon: LucideIcon;
  count?: string;
  cls: string;
}
const items: ToolbarItem[] = [{
  path: '',
  label: 'Case home — Activity Sheets',
  icon: HouseIcon,
  cls: 'text-success-700'
}, {
  path: '/rating',
  label: 'Rating activity',
  icon: ClipboardListIcon,
  cls: 'text-brand-700'
}, {
  path: '/rating/edit',
  label: 'Medical rating (1)',
  icon: HeartPulseIcon,
  count: '1',
  cls: 'text-danger-600'
}, {
  path: '/ra-sheet',
  label: 'Documents (2, 4)',
  icon: FolderIcon,
  count: '2, 4',
  cls: 'text-ink-700'
}, {
  path: '/message',
  label: 'Team (3)',
  icon: UsersIcon,
  count: '3',
  cls: 'text-success-700'
}, {
  path: '/message?type=wall',
  label: 'Messages',
  icon: MessageSquareIcon,
  cls: 'text-brand-700'
}];
export function CaseToolbar({
  caseId


}: {caseId: string;}) {
  const {
    pathname,
    search
  } = useLocation();
  const activeIndex = items.findIndex((i) => `/case/${caseId}${i.path}` === `${pathname}${search}`);
  return <nav aria-label="Case navigation" className="flex items-center rounded-md border border-ink-200 bg-white p-0.5 shadow-xs">
      {items.map((item, index) => {
      const Icon = item.icon;
      const active = index === activeIndex;
      return <Link key={item.label} to={`/case/${caseId}${item.path}`} aria-label={item.label} title={item.label} aria-current={active ? 'page' : undefined} className={twMerge('focus-ring inline-flex h-7 items-center gap-1 rounded px-2 text-xs font-medium transition-colors duration-150', active ? 'bg-brand-50 ring-1 ring-inset ring-brand-200' : 'hover:bg-ink-100', item.cls)}>
            <Icon className="h-4 w-4" aria-hidden="true" />
            {item.count && <span className="text-ink-700">({item.count})</span>}
          </Link>;
    })}
    </nav>;
}