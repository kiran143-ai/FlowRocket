import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClipboardListIcon, FolderIcon, HeartPulseIcon, HouseIcon, LucideAngularModule, LucideIconData, MessageSquareIcon, UsersIcon } from 'lucide-angular';
import { currentUrl } from '../core/services/current-url';
import { cn } from '../core/utils/cn';
import { Tooltip } from '../shared/ui/tooltip';

interface ToolbarItem {
  path: string;
  query?: Record<string, string>;
  label: string;
  icon: LucideIconData;
  count?: string;
  cls: string;
}

const items: ToolbarItem[] = [
  { path: '', label: 'Case home — Activity Sheets', icon: HouseIcon, cls: 'text-success-700' },
  { path: '/rating', label: 'Rating activity', icon: ClipboardListIcon, cls: 'text-brand-700' },
  { path: '/rating/edit', label: 'Medical rating (1)', icon: HeartPulseIcon, count: '1', cls: 'text-danger-600' },
  { path: '/ra-sheet', label: 'Documents (2, 4)', icon: FolderIcon, count: '2, 4', cls: 'text-ink-700' },
  { path: '/message', label: 'Team (3)', icon: UsersIcon, count: '3', cls: 'text-success-700' },
  { path: '/message', query: { type: 'wall' }, label: 'Messages', icon: MessageSquareIcon, cls: 'text-brand-700' }
];

@Component({
  selector: 'app-case-toolbar',
  imports: [Tooltip, RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
  `
})
export class CaseToolbar {
  readonly caseId = input.required<string>();
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
}
