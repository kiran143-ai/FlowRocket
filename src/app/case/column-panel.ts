import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';
import { cn } from '../core/utils/cn';

const tones = {
  success: { bar: 'border-t-success-500', chip: 'bg-success-50 text-success-700' },
  warning: { bar: 'border-t-warning-500', chip: 'bg-warning-50 text-warning-700' },
  brand: { bar: 'border-t-brand-500', chip: 'bg-brand-50 text-brand-700' }
};

let nextId = 0;

/** Activity Sheet column. Header controls go in an element marked `columnActions`. */
@Component({
  selector: 'app-column-panel',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()', '[attr.aria-labelledby]': 'titleId', role: 'region' },
  template: `
    <header class="flex min-h-[48px] items-center justify-between gap-2 border-b border-ink-100 px-4 py-1.5">
      <h2 [id]="titleId" class="flex items-center gap-2 text-sm font-semibold text-ink-900">
        <span [class]="chipClass()" aria-hidden="true"><lucide-icon [img]="icon()" class="h-4 w-4" /></span>
        {{ heading() }}
      </h2>
      <ng-content select="[columnActions]" />
    </header>
    <div class="flex-1 overflow-y-auto p-4 lg:max-h-[calc(100vh-420px)] lg:min-h-[320px]"><ng-content /></div>
  `
})
export class ColumnPanel {
  readonly heading = input.required<string>();
  readonly icon = input.required<LucideIconData>();
  readonly tone = input.required<keyof typeof tones>();
  protected readonly titleId = `column-${++nextId}`;
  protected readonly classes = computed(() =>
    cn('flex min-h-0 flex-col overflow-hidden rounded-xl border border-t-[3px] border-ink-200 bg-white shadow-raised', tones[this.tone()].bar)
  );
  protected readonly chipClass = computed(() => cn('grid h-7 w-7 place-items-center rounded-md', tones[this.tone()].chip));
}
