import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, contentChildren, Directive, ElementRef, inject, input, linkedSignal, signal, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  DownloadIcon,
  FileDownIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  InboxIcon,
  LucideAngularModule,
  PrinterIcon,
  RefreshCwIcon,
  SearchIcon
} from 'lucide-angular';
import { toast } from 'ngx-sonner';
import { cn } from '../core/utils/cn';
import { Control, InputIcon, SelectShell } from './ui/form-controls';
import { Tooltip } from './ui/tooltip';

export interface Column<T> {
  key: string;
  header: string;
  hideHeaderLabel?: boolean;
  sortValue?: (row: T) => string | number;
  /** Plain-text cell content, used when no `appCell` template is given for this key. */
  value?: (row: T) => string | number;
  className?: string;
}

/** Custom cell template: <ng-template appCell="claimant" let-row>…</ng-template> */
@Directive({ selector: 'ng-template[appCell]' })
export class Cell {
  readonly key = input.required<string>({ alias: 'appCell' });
  readonly template = inject(TemplateRef);
}

const PAGE_SIZES = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
  { value: -1, label: 'All' }
];

const EXPORTS = [
  { kind: 'copy', label: 'Copy', icon: CopyIcon, cls: 'text-brand-700' },
  { kind: 'excel', label: 'Export to Excel', icon: FileSpreadsheetIcon, cls: 'text-success-700' },
  { kind: 'pdf', label: 'Export to PDF', icon: FileTextIcon, cls: 'text-danger-600' },
  { kind: 'csv', label: 'Export to CSV', icon: FileDownIcon, cls: 'text-brand-700' },
  { kind: 'print', label: 'Print', icon: PrinterIcon, cls: 'text-ink-700' }
] as const;

/** The grid used across the app: page size, export tools, search, sortable headers, pagination. */
@Component({
  selector: 'app-data-table',
  imports: [NgTemplateOutlet, FormsModule, LucideAngularModule, Control, SelectShell, InputIcon, Tooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block', '(document:click)': 'onDocClick($event)' },
  template: `
    @if (toolbar() !== 'none') {
      <div class="flex flex-wrap items-center gap-3 px-4 py-3">
        <app-input-icon [icon]="SearchIcon" class="w-full sm:w-64">
          <input appControl="pl-8" controlSize="sm" type="search" placeholder="Search" [attr.aria-label]="'Search ' + label()" [ngModel]="query()" (ngModelChange)="query.set($event); page.set(1)" />
        </app-input-icon>
        @if (toolbar() === 'full') {
          <div class="ml-auto flex flex-wrap items-center gap-2">
            <div class="flex items-center gap-2 text-[13px] text-ink-500">
              <label [for]="id() + '-size'">Rows</label>
              <app-select class="w-[76px]">
                <select appControl controlSize="sm" [id]="id() + '-size'" [ngModel]="pageSize()" (ngModelChange)="pageSize.set(+$event); page.set(1)">
                  @for (s of pageSizes; track s.value) {
                    <option [value]="s.value">{{ s.label }}</option>
                  }
                </select>
              </app-select>
            </div>
            <div class="relative" (keydown.escape)="closeMenu(trigger)">
              <button
                #trigger
                type="button"
                aria-haspopup="menu"
                [attr.aria-expanded]="menuOpen()"
                [attr.aria-controls]="id() + '-export-menu'"
                (click)="toggleMenu()"
                class="focus-ring inline-flex h-8 items-center gap-1.5 rounded-md border border-ink-200 bg-white px-2.5 text-[13px] font-medium text-ink-700 shadow-xs transition-colors duration-150 hover:border-ink-300 hover:bg-ink-50">
                <lucide-icon [img]="DownloadIcon" class="h-4 w-4 text-ink-500" aria-hidden="true" />
                Export
                <lucide-icon [img]="ChevronDownIcon" [class]="menuOpen() ? 'h-3.5 w-3.5 rotate-180 text-ink-400 transition-transform' : 'h-3.5 w-3.5 text-ink-400 transition-transform'" aria-hidden="true" />
              </button>
              @if (menuOpen()) {
                <div
                  [id]="id() + '-export-menu'"
                  role="menu"
                  [attr.aria-label]="label() + ' export options'"
                  animate.enter="fr-dialog-enter"
                  (keydown)="onMenuKey($event)"
                  class="absolute right-0 top-full z-20 mt-1.5 w-52 rounded-lg border border-ink-200 bg-white p-1 shadow-lifted">
                  @for (e of exports; track e.kind) {
                    @if (e.kind === 'print') {
                      <div class="my-1 h-px bg-ink-100" role="separator"></div>
                    }
                    <button
                      type="button"
                      role="menuitem"
                      (click)="runExport(e.kind); closeMenu(trigger)"
                      class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[13px] text-ink-900 transition-colors duration-150 hover:bg-ink-50 focus:outline-none focus-visible:bg-ink-100 focus-visible:ring-0 focus-visible:ring-offset-0">
                      <lucide-icon [img]="e.icon" [class]="'h-4 w-4 ' + e.cls" aria-hidden="true" />
                      {{ e.label }}
                    </button>
                  }
                </div>
              }
            </div>
            <button
              type="button"
              aria-label="Refresh"
              appTooltip="Refresh"
              (click)="refresh()"
              class="focus-ring grid h-8 w-8 place-items-center rounded-md border border-ink-200 bg-white text-ink-500 shadow-xs transition-colors duration-150 hover:border-ink-300 hover:bg-ink-50 hover:text-ink-900">
              <lucide-icon [img]="RefreshCwIcon" [class]="refreshing() ? 'h-4 w-4 animate-spin' : 'h-4 w-4'" aria-hidden="true" />
            </button>
          </div>
        }
      </div>
    }

    <div class="overflow-x-auto border-y border-ink-100 transition-opacity duration-150" [class.opacity-50]="refreshing()" [attr.aria-busy]="refreshing() || null">
      <table class="w-full border-collapse text-[13px]">
        <caption class="sr-only">{{ label() }}</caption>
        <thead class="bg-ink-50/70">
          <tr>
            @for (col of columns(); track col.key) {
              <th scope="col" [attr.aria-sort]="ariaSort(col.key)" [class]="headerClass(col)">
                @if (col.sortValue) {
                  <button type="button" (click)="toggleSort(col.key)" class="focus-ring -mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors duration-150 hover:text-ink-900">
                    <span [class.sr-only]="col.hideHeaderLabel">{{ col.header }}</span>
                    @if (sort()?.key === col.key) {
                      <lucide-icon [img]="sort()!.dir === 'asc' ? ArrowUpIcon : ArrowDownIcon" class="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                    } @else {
                      <lucide-icon [img]="ArrowUpDownIcon" class="h-3.5 w-3.5 text-ink-400" aria-hidden="true" />
                    }
                  </button>
                } @else {
                  <span [class.sr-only]="col.hideHeaderLabel">{{ col.header }}</span>
                }
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of visible(); track rowId()(row)) {
            <tr [class]="rowClasses(row)">
              @for (col of columns(); track col.key) {
                <td [class]="cellClass(col)">
                  @if (templates()[col.key]; as tpl) {
                    <ng-container [ngTemplateOutlet]="tpl" [ngTemplateOutletContext]="{ $implicit: row }" />
                  } @else {
                    {{ col.value?.(row) }}
                  }
                </td>
              }
            </tr>
          } @empty {
            <tr>
              <td [attr.colspan]="columns().length" class="border-t border-ink-100 px-3 py-10 text-center">
                <span class="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-full bg-ink-100 text-ink-400" aria-hidden="true">
                  <lucide-icon [img]="query().trim() ? SearchIcon : InboxIcon" class="h-4 w-4" />
                </span>
                <p class="text-[13px] font-medium text-ink-700">{{ query().trim() ? 'No matches for “' + query().trim() + '”' : emptyMessage() }}</p>
                @if (query().trim()) {
                  <button type="button" class="link mt-1 text-xs" (click)="query.set('')">Clear search</button>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5">
      <p class="text-xs text-ink-500" aria-live="polite">
        Showing {{ range().from }} to {{ range().to }} of {{ sorted().length }} entries
        @if (query().trim() && rows().length !== sorted().length) {
          <span>(filtered from {{ rows().length }} total entries)</span>
        }
      </p>
      <nav [attr.aria-label]="label() + ' pagination'" class="flex items-center gap-1" [class.invisible]="pageCount() < 2">
        <button type="button" aria-label="Previous page" [disabled]="current() <= 1" (click)="page.set(current() - 1)" [class]="pagerArrow">
          <lucide-icon [img]="ChevronLeftIcon" class="h-4 w-4" aria-hidden="true" />
        </button>
        @for (p of pages(); track p) {
          <button type="button" [attr.aria-label]="'Page ' + p" [attr.aria-current]="p === current() ? 'page' : null" (click)="page.set(p)" [class]="pageClass(p)">{{ p }}</button>
        }
        <button type="button" aria-label="Next page" [disabled]="current() >= pageCount()" (click)="page.set(current() + 1)" [class]="pagerArrow">
          <lucide-icon [img]="ChevronRightIcon" class="h-4 w-4" aria-hidden="true" />
        </button>
      </nav>
    </div>
  `
})
export class DataTable<T> {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly columns = input.required<Column<T>[]>();
  readonly rows = input.required<T[]>();
  readonly rowId = input.required<(row: T) => string>();
  readonly searchText = input.required<(row: T) => string>();
  readonly defaultPageSize = input(-1);
  readonly toolbar = input<'full' | 'search' | 'none'>('full');
  readonly rowClass = input<(row: T) => string | undefined>();
  readonly emptyMessage = input('No Records Found');

  private readonly cells = contentChildren(Cell);
  protected readonly templates = computed(() => Object.fromEntries(this.cells().map((c) => [c.key(), c.template])) as Record<string, TemplateRef<unknown>>);

  protected readonly pageSize = linkedSignal(() => this.defaultPageSize());
  protected readonly query = signal('');
  protected readonly sort = signal<{ key: string; dir: 'asc' | 'desc' } | null>(null);
  protected readonly page = signal(1);
  protected readonly refreshing = signal(false);
  protected readonly menuOpen = signal(false);
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;

  private readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const text = this.searchText();
    return q ? this.rows().filter((r) => text(r).toLowerCase().includes(q)) : this.rows();
  });

  protected readonly sorted = computed(() => {
    const s = this.sort();
    const get = s && this.columns().find((c) => c.key === s.key)?.sortValue;
    if (!s || !get) return this.filtered();
    return [...this.filtered()].sort((a, b) => {
      const av = get(a);
      const bv = get(b);
      const r = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv), undefined, { numeric: true });
      return s.dir === 'asc' ? r : -r;
    });
  });

  private readonly size = computed(() => (this.pageSize() === -1 ? Math.max(this.sorted().length, 1) : this.pageSize()));
  protected readonly pageCount = computed(() => Math.max(1, Math.ceil(this.sorted().length / this.size())));
  protected readonly current = computed(() => Math.min(this.page(), this.pageCount()));
  protected readonly pages = computed(() => Array.from({ length: this.pageCount() }, (_, i) => i + 1));
  protected readonly visible = computed(() => {
    const start = (this.current() - 1) * this.size();
    return this.sorted().slice(start, start + this.size());
  });
  protected readonly range = computed(() => {
    const start = (this.current() - 1) * this.size();
    const n = this.sorted().length;
    return { from: n ? start + 1 : 0, to: Math.min(start + this.size(), n) };
  });

  protected readonly pageSizes = PAGE_SIZES;
  protected readonly exports = EXPORTS;
  protected readonly pagerArrow =
    'focus-ring grid h-7 w-7 place-items-center rounded-md text-ink-700 transition-colors duration-150 hover:bg-ink-100 disabled:cursor-not-allowed disabled:text-ink-300 disabled:hover:bg-transparent';
  protected readonly RefreshCwIcon = RefreshCwIcon;
  protected readonly DownloadIcon = DownloadIcon;
  protected readonly ChevronDownIcon = ChevronDownIcon;
  protected readonly InboxIcon = InboxIcon;
  protected readonly SearchIcon = SearchIcon;
  protected readonly ArrowUpIcon = ArrowUpIcon;
  protected readonly ArrowDownIcon = ArrowDownIcon;
  protected readonly ArrowUpDownIcon = ArrowUpDownIcon;
  protected readonly ChevronLeftIcon = ChevronLeftIcon;
  protected readonly ChevronRightIcon = ChevronRightIcon;

  protected toggleSort(key: string): void {
    this.sort.update((s) => (s?.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
  }

  protected ariaSort(key: string): string | null {
    const s = this.sort();
    return s?.key === key ? (s.dir === 'asc' ? 'ascending' : 'descending') : null;
  }

  protected runExport(kind: (typeof EXPORTS)[number]['kind']): void {
    const count = this.filtered().length;
    const noun = count === 1 ? 'row' : 'rows';
    if (kind === 'copy') {
      navigator.clipboard?.writeText(this.filtered().map(this.searchText()).join('\n')).catch(() => undefined);
      toast.success(`Copied ${count} ${noun} from ${this.label()}`);
    } else if (kind === 'print') {
      toast.success(`Preparing ${this.label()} for printing`);
    } else {
      toast.success(`${this.label()} exported`, { description: `${count} ${noun} · ${kind.toUpperCase()}` });
    }
  }

  protected toggleMenu(): void {
    this.menuOpen.update((o) => !o);
    if (this.menuOpen()) setTimeout(() => this.menuItems()[0]?.focus());
  }

  /** Arrow keys / Home / End move between menu items. */
  protected onMenuKey(e: KeyboardEvent): void {
    const items = this.menuItems();
    const i = items.indexOf(document.activeElement as HTMLElement);
    const next = { ArrowDown: (i + 1) % items.length, ArrowUp: (i - 1 + items.length) % items.length, Home: 0, End: items.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    items[next]?.focus();
  }

  private menuItems(): HTMLElement[] {
    return Array.from(this.host.querySelectorAll<HTMLElement>('[role="menuitem"]'));
  }

  protected closeMenu(trigger: HTMLElement): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    trigger.focus();
  }

  protected onDocClick(e: MouseEvent): void {
    if (this.menuOpen() && !this.host.querySelector('[aria-haspopup="menu"]')?.parentElement?.contains(e.target as Node)) this.menuOpen.set(false);
  }

  protected refresh(): void {
    this.refreshing.set(true);
    setTimeout(() => this.refreshing.set(false), 600);
  }

  protected exportClass = (cls: string) => cn('focus-ring grid h-7 w-7 place-items-center rounded transition-colors duration-150 hover:bg-ink-100', cls);
  protected headerClass = (col: Column<T>) => cn('whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-500', col.className);
  protected cellClass = (col: Column<T>) => cn('border-t border-ink-100 px-4 py-3 align-middle text-ink-900', col.className);
  protected rowClasses = (row: T) => cn('transition-colors duration-150 hover:bg-brand-50/60', this.rowClass()?.(row));
  protected pageClass = (p: number) =>
    cn('focus-ring h-7 min-w-[28px] rounded-md px-2 text-[13px] font-medium transition-colors duration-150', p === this.current() ? 'bg-brand-600 text-white' : 'text-ink-700 hover:bg-ink-100');
}
