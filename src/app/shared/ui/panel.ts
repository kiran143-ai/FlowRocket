import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';
import { cn } from '../../core/utils/cn';

let nextId = 0;

/** Titled card. Put header controls in an element marked `panelActions`. */
@Component({
  selector: 'app-panel',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block rounded-xl border border-ink-200 bg-white shadow-raised' },
  template: `
    <section [attr.aria-labelledby]="heading() ? titleId : null">
      @if (heading()) {
        <header class="flex min-h-[56px] flex-wrap items-center justify-between gap-2 border-b border-ink-100 px-5 py-3">
          <div class="flex min-w-0 items-center gap-2">
            @if (icon()) {
              <lucide-icon [img]="icon()!" class="h-4 w-4 text-brand-600" aria-hidden="true" />
            }
            <h2 [id]="titleId" class="truncate text-[15px] font-semibold text-ink-900">{{ heading() }}</h2>
            @if (count() !== undefined) {
              <span class="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-semibold tabular-nums text-ink-700" [attr.aria-label]="count() + ' items'">{{ count() }}</span>
            }
          </div>
          <ng-content select="[panelActions]" />
        </header>
      }
      <div [class]="bodyClasses()"><ng-content /></div>
    </section>
  `
})
export class Panel {
  readonly heading = input<string>();
  readonly icon = input<LucideIconData>();
  readonly bodyClass = input('');
  /** Optional item count shown as a pill beside the title. */
  readonly count = input<number>();
  protected readonly titleId = `panel-${++nextId}`;
  protected readonly bodyClasses = computed(() => cn('p-4', this.bodyClass()));
}
