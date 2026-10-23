import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ArrowRightIcon, LucideAngularModule, LucideIconData } from 'lucide-angular';
import { cn } from '../../core/utils/cn';

export type StatTone = 'brand' | 'warning' | 'success' | 'neutral' | 'danger';

const tones: Record<StatTone, { bar: string; chip: string; active: string; badge: string }> = {
  brand: { bar: 'bg-brand-500', chip: 'bg-brand-50 text-brand-600 ring-brand-100', active: 'ring-brand-500 bg-brand-50/40', badge: 'bg-brand-50 text-brand-700' },
  warning: { bar: 'bg-warning-500', chip: 'bg-warning-50 text-warning-600 ring-warning-100', active: 'ring-warning-500 bg-warning-50/40', badge: 'bg-warning-50 text-warning-700' },
  success: { bar: 'bg-success-500', chip: 'bg-success-50 text-success-600 ring-success-100', active: 'ring-success-500 bg-success-50/40', badge: 'bg-success-50 text-success-700' },
  danger: { bar: 'bg-danger-500', chip: 'bg-danger-50 text-danger-600 ring-danger-100', active: 'ring-danger-500 bg-danger-50/40', badge: 'bg-danger-50 text-danger-700' },
  neutral: { bar: 'bg-ink-400', chip: 'bg-ink-100 text-ink-700 ring-ink-200', active: 'ring-ink-500 bg-ink-50', badge: 'bg-ink-100 text-ink-700' }
};

/**
 * Metric tile: tone accent bar, icon, large figure, explanation and an optional action footer.
 * With `interactive`, the whole card is a button that emits `activate`.
 */
@Component({
  selector: 'app-stat-card',
  imports: [LucideAngularModule, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  template: `
    <ng-template #body>
      <span [class]="barClass()" aria-hidden="true"></span>
      <div class="flex flex-1 flex-col justify-center px-4 pb-2.5 pt-3.5">
        <div class="flex items-center gap-3">
          <span [class]="chipClass()" aria-hidden="true"><lucide-icon [img]="icon()" class="h-4 w-4" /></span>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <p class="text-2xl font-semibold leading-none tracking-tight tabular-nums text-ink-900">{{ value() }}</p>
              @if (badge()) {
                <span [class]="badgeClass()">
                  <span class="relative flex h-1.5 w-1.5" aria-hidden="true">
                    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60 motion-reduce:hidden"></span>
                    <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-current"></span>
                  </span>
                  {{ badge() }}
                </span>
              }
            </div>
            <p class="mt-1 truncate text-[13px] font-semibold text-ink-900">{{ label() }}</p>
          </div>
          @if (eyebrow()) {
            <span class="self-start text-[10px] font-semibold uppercase tracking-wider text-ink-400">{{ eyebrow() }}</span>
          }
        </div>
        @if (hint()) {
          <p class="mt-1.5 truncate text-xs text-ink-500" [attr.title]="hint()">{{ hint() }}</p>
        }
      </div>
      @if (action()) {
        <span class="flex items-center justify-between border-t border-ink-100 px-4 py-1.5 text-xs font-semibold text-brand-700 transition-colors duration-150 group-hover:bg-ink-50/70 group-hover:text-brand-900">
          {{ action() }}
          <lucide-icon [img]="ArrowRightIcon" class="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      }
    </ng-template>

    @if (interactive()) {
      <button type="button" [class]="cardClass()" [attr.aria-pressed]="active()" (click)="activate.emit()">
        <ng-container [ngTemplateOutlet]="body" />
      </button>
    } @else {
      <div [class]="cardClass()"><ng-container [ngTemplateOutlet]="body" /></div>
    }
  `
})
export class StatCard {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly icon = input.required<LucideIconData>();
  readonly tone = input<StatTone>('brand');
  readonly hint = input<string>();
  readonly eyebrow = input<string>();
  /** Small pulsing pill beside the figure, e.g. "Needs action". */
  readonly badge = input<string>();
  readonly action = input<string>();
  readonly interactive = input(false, { transform: booleanAttribute });
  readonly active = input(false, { transform: booleanAttribute });
  readonly activate = output<void>();
  protected readonly ArrowRightIcon = ArrowRightIcon;

  protected readonly barClass = computed(() => cn('absolute inset-x-0 top-0 h-1', tones[this.tone()].bar));
  protected readonly chipClass = computed(() => cn('grid h-9 w-9 shrink-0 place-items-center rounded-lg ring-1 ring-inset', tones[this.tone()].chip));
  protected readonly badgeClass = computed(() => cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold', tones[this.tone()].badge));
  protected readonly cardClass = computed(() =>
    cn(
      'group relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-ink-200 bg-white text-left shadow-raised',
      this.interactive() && 'focus-ring transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-lifted motion-reduce:hover:translate-y-0',
      this.active() && cn('ring-2', tones[this.tone()].active)
    )
  );
}
