import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  FileDownIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  PrinterIcon,
  RefreshCwIcon,
  SearchIcon } from
'lucide-react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { Select } from './ui/Select';
import { TextInput } from './ui/TextInput';

export interface Column<T> {
  key: string;
  header: string;
  hideHeaderLabel?: boolean;
  sortValue?: (row: T) => string | number;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  id: string;
  label: string;
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  getSearchText: (row: T) => string;
  defaultPageSize?: number;
  toolbar?: 'full' | 'search' | 'none';
  rowClassName?: (row: T) => string | undefined;
  emptyMessage?: string;
}

const PAGE_SIZES = [
{ value: 5, label: '5' },
{ value: 10, label: '10' },
{ value: 25, label: '25' },
{ value: 50, label: '50' },
{ value: -1, label: 'All' }];


const EXPORTS = [
{ kind: 'copy', label: 'Copy', icon: CopyIcon, cls: 'text-brand-700' },
{ kind: 'excel', label: 'Export to Excel', icon: FileSpreadsheetIcon, cls: 'text-success-700' },
{ kind: 'pdf', label: 'Export to PDF', icon: FileTextIcon, cls: 'text-danger-600' },
{ kind: 'csv', label: 'Export to CSV', icon: FileDownIcon, cls: 'text-brand-700' },
{ kind: 'print', label: 'Print', icon: PrinterIcon, cls: 'text-ink-700' }] as
const;

export function DataTable<T>({
  id,
  label,
  columns,
  rows,
  getRowId,
  getSearchText,
  defaultPageSize = -1,
  toolbar = 'full',
  rowClassName,
  emptyMessage = 'No Records Found'
}: DataTableProps<T>) {
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<{key: string;dir: 'asc' | 'desc';} | null>(null);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const q = query.trim().toLowerCase();
  const filtered = q ? rows.filter((r) => getSearchText(r).toLowerCase().includes(q)) : rows;
  const sortCol = sort ? columns.find((c) => c.key === sort.key) : undefined;
  const sorted = sortCol?.sortValue ?
  [...filtered].sort((a, b) => {
    const get = sortCol.sortValue as (row: T) => string | number;
    const av = get(a);
    const bv = get(b);
    const r = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv), undefined, { numeric: true });
    return sort?.dir === 'asc' ? r : -r;
  }) :
  filtered;

  const size = pageSize === -1 ? Math.max(sorted.length, 1) : pageSize;
  const pageCount = Math.max(1, Math.ceil(sorted.length / size));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * size;
  const visible = sorted.slice(start, start + size);
  const showingFrom = sorted.length ? start + 1 : 0;
  const showingTo = Math.min(start + size, sorted.length);

  const toggleSort = (key: string) => {
    setSort((s) => s?.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });
  };

  const runExport = (kind: (typeof EXPORTS)[number]['kind']) => {
    const count = filtered.length;
    const noun = count === 1 ? 'row' : 'rows';
    if (kind === 'copy') {
      navigator.clipboard?.writeText(filtered.map(getSearchText).join('\n'))?.catch(() => undefined);
      toast.success(`Copied ${count} ${noun} from ${label}`);
      return;
    }
    if (kind === 'print') {
      toast.success(`Preparing ${label} for printing`);
      return;
    }
    toast.success(`${label} exported`, { description: `${count} ${noun} · ${kind.toUpperCase()}` });
  };

  const refresh = () => {
    setRefreshing(true);
    timer.current = window.setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <div>
      {toolbar !== 'none' &&
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          {toolbar === 'full' ?
        <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-[13px] text-ink-700">
                <label htmlFor={`${id}-size`}>Show</label>
                <Select
              id={`${id}-size`}
              selectSize="sm"
              wrapperClassName="w-[76px]"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}>
              
                  {PAGE_SIZES.map((s) =>
              <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
              )}
                </Select>
                <span>entries</span>
              </div>
              <div role="group" aria-label={`${label} export options`} className="flex items-center rounded-md border border-ink-200 bg-white p-0.5 shadow-xs">
                {EXPORTS.map(({ kind, label: l, icon: Icon, cls }) =>
            <button
              key={kind}
              type="button"
              aria-label={l}
              title={l}
              onClick={() => runExport(kind)}
              className={twMerge('focus-ring grid h-7 w-7 place-items-center rounded transition-colors duration-150 hover:bg-ink-100', cls)}>
              
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </button>
            )}
                <span className="mx-0.5 h-4 w-px bg-ink-200" aria-hidden="true" />
                <button
              type="button"
              aria-label="Refresh"
              title="Refresh"
              onClick={refresh}
              className="focus-ring grid h-7 w-7 place-items-center rounded text-brand-700 transition-colors duration-150 hover:bg-ink-100">
              
                  <RefreshCwIcon className={twMerge('h-4 w-4', refreshing && 'animate-spin')} aria-hidden="true" />
                </button>
              </div>
            </div> :

        <span />
        }
          <div className="w-full sm:w-60">
            <TextInput
            inputSize="sm"
            type="search"
            aria-label={`Search ${label}`}
            placeholder="Search"
            leadingIcon={<SearchIcon />}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }} />
          
          </div>
        </div>
      }

      <div className={twMerge('overflow-x-auto border-y border-ink-100 transition-opacity duration-150', refreshing && 'opacity-50')} aria-busy={refreshing || undefined}>
        <table className="w-full border-collapse text-[13px]">
          <caption className="sr-only">{label}</caption>
          <thead className="bg-ink-50">
            <tr>
              {columns.map((col) => {
                const active = sort?.key === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={active ? sort?.dir === 'asc' ? 'ascending' : 'descending' : undefined}
                    className={twMerge('whitespace-nowrap px-3 py-2.5 text-left text-xs font-semibold text-ink-700', col.className)}>
                    
                    {col.sortValue ?
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className="focus-ring -mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors duration-150 hover:text-ink-900">
                      
                        <span className={col.hideHeaderLabel ? 'sr-only' : undefined}>{col.header}</span>
                        {active ?
                      sort?.dir === 'asc' ?
                      <ArrowUpIcon className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" /> :

                      <ArrowDownIcon className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" /> :


                      <ArrowUpDownIcon className="h-3.5 w-3.5 text-ink-400" aria-hidden="true" />
                      }
                      </button> :

                    <span className={col.hideHeaderLabel ? 'sr-only' : undefined}>{col.header}</span>
                    }
                  </th>);

              })}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ?
            <tr>
                <td colSpan={columns.length} className="border-t border-ink-100 px-3 py-8 text-center text-ink-500">
                  {emptyMessage}
                </td>
              </tr> :

            visible.map((row) =>
            <tr key={getRowId(row)} className={twMerge('transition-colors duration-150 hover:bg-brand-50/60', rowClassName?.(row))}>
                  {columns.map((col) =>
              <td key={col.key} className={twMerge('border-t border-ink-100 px-3 py-2.5 align-middle text-ink-900', col.className)}>
                      {col.render(row)}
                    </td>
              )}
                </tr>
            )
            }
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <p className="text-[13px] text-ink-500" aria-live="polite">
          Showing {showingFrom} to {showingTo} of {sorted.length} entries
          {q && rows.length !== sorted.length && <span> (filtered from {rows.length} total entries)</span>}
        </p>
        <nav aria-label={`${label} pagination`} className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous page"
            disabled={current <= 1}
            onClick={() => setPage(current - 1)}
            className="focus-ring grid h-7 w-7 place-items-center rounded-md text-ink-700 transition-colors duration-150 hover:bg-ink-100 disabled:cursor-not-allowed disabled:text-ink-300 disabled:hover:bg-transparent">
            
            <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) =>
          <button
            key={p}
            type="button"
            aria-label={`Page ${p}`}
            aria-current={p === current ? 'page' : undefined}
            onClick={() => setPage(p)}
            className={twMerge(
              'focus-ring h-7 min-w-[28px] rounded-md px-2 text-[13px] font-medium transition-colors duration-150',
              p === current ? 'bg-brand-600 text-white' : 'text-ink-700 hover:bg-ink-100'
            )}>
            
              {p}
            </button>
          )}
          <button
            type="button"
            aria-label="Next page"
            disabled={current >= pageCount}
            onClick={() => setPage(current + 1)}
            className="focus-ring grid h-7 w-7 place-items-center rounded-md text-ink-700 transition-colors duration-150 hover:bg-ink-100 disabled:cursor-not-allowed disabled:text-ink-300 disabled:hover:bg-transparent">
            
            <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>);

}