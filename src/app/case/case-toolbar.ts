import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClipboardListIcon, FolderIcon, HeartPulseIcon, HouseIcon, LucideAngularModule, LucideIconData, MessageSquareIcon, UsersIcon } from 'lucide-angular';
import { currentUrl } from '../core/services/current-url';
import { ThemeService } from '../core/services/theme.service';
import { cn } from '../core/utils/cn';
import { Tooltip } from '../shared/ui/tooltip';

interface ToolbarItem {
  path: string;
  query?: Record<string, string>;
  label: string;
  /** Short name for the Evergreen tab row. */
  short: string;
  icon: LucideIconData;
  count?: string;
  cls: string;
}

const items: ToolbarItem[] = [
  { path: '', short: 'Activity sheets', label: 'Case home — Activity Sheets', icon: HouseIcon, cls: 'text-success-700' },
  { path: '/rating', short: 'Rating activity', label: 'Rating activity', icon: ClipboardListIcon, cls: 'text-brand-700' },
  { path: '/rating/edit', short: 'Medical rating', label: 'Medical rating (1)', icon: HeartPulseIcon, count: '1', cls: 'text-danger-600' },
  { path: '/ra-sheet', short: 'Documents', label: 'Documents (2, 4)', icon: FolderIcon, count: '2, 4', cls: 'text-ink-700' },
  { path: '/message', short: 'Team', label: 'Team (3)', icon: UsersIcon, count: '3', cls: 'text-success-700' },
  { path: '/message', query: { type: 'wall' }, short: 'Messages', label: 'Messages', icon: MessageSquareIcon, cls: 'text-brand-700' }
];

@Component({
  selector: 'app-case-toolbar',
  imports: [Tooltip, RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (theme.isEvergreen()) {
      <nav aria-label="Case navigation" class="-mb-px flex gap-1 overflow-x-auto">
        @for (item of items; track item.label; let i = $index) {
          <a
            [routerLink]="'/case/' + caseId() + item.path"
            [queryParams]="item.query"
            [attr.aria-label]="item.label"
            [attr.aria-current]="i === activeIndex() ? 'page' : null"
            [class]="tabClass(i === activeIndex())">
            {{ item.short }}
            @if (item.count) {
              <span class="rounded-full bg-ink-100 px-1.5 py-px text-[11px] font-semibold tabular-nums text-ink-700">{{ item.count }}</span>
            }
          </a>
        }
      </nav>
    } @else {
      <nav aria-label="Case navigation" class="flex items-center rounded-md border border-ink-200 bg-white p-0.5 shadow-xs">
        @for (item of items; track item.label; let i = $index) {
          <a
            [routerLink]="'/case/' + caseId() + item.path"
            [queryParams]="item.query"
            [attr.aria-label]="item.label"
            [appTooltip]="item.label"
            [attr.aria-current]="i === activeIndex() ? 'page' : null"
            [class]="itemClass(item, i === activeIndex())">
            <lucide-icon [img]="item.icon" class="h-4 w-4" aria-hidden="true" />
            @if (item.count) {
              <span class="text-ink-700">({{ item.count }})</span>
            }
          </a>
        }
      </nav>
    }
  `
})
export class CaseToolbar {
  readonly caseId = input.required<string>();
  protected readonly theme = inject(ThemeService);
  private readonly url = currentUrl();
  protected readonly items = items;

  protected readonly activeIndex = computed(() =>
    items.findIndex((i) => {
      const q = i.query ? '?' + new URLSearchParams(i.query).toString() : '';
      return `/case/${this.caseId()}${i.path}${q}` === this.url();
    })
  );

  protected itemClass = (item: ToolbarItem, active: boolean) =>
    cn(
      'focus-ring inline-flex h-7 items-center gap-1 rounded px-2 text-xs font-medium transition-colors duration-150',
      active ? 'bg-brand-50 ring-1 ring-inset ring-brand-200' : 'hover:bg-ink-100',
      item.cls
    );

  protected tabClass = (active: boolean) =>
    cn(
      'focus-ring -mb-px inline-flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-[13px] font-medium transition-colors duration-150 focus-visible:ring-inset',
      active ? 'border-brand-600 text-brand-700' : 'border-transparent text-ink-500 hover:border-ink-300 hover:text-ink-900'
    );
}
