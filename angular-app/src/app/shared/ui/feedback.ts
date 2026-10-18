import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, LucideAngularModule, LucideIconData, TriangleAlertIcon } from 'lucide-angular';
import { cn } from '../../core/utils/cn';

type AlertTone = 'info' | 'success' | 'warning' | 'danger';

const config: Record<AlertTone, { cls: string; icon: LucideIconData }> = {
  info: { cls: 'border-brand-200 bg-brand-50 text-brand-900 [&_svg]:text-brand-600', icon: InfoIcon },
  success: { cls: 'border-success-100 bg-success-50 text-success-700 [&_svg]:text-success-600', icon: CircleCheckIcon },
  warning: { cls: 'border-warning-100 bg-warning-50 text-warning-700 [&_svg]:text-warning-600', icon: TriangleAlertIcon },
  danger: { cls: 'border-danger-100 bg-danger-50 text-danger-700 [&_svg]:text-danger-600', icon: CircleAlertIcon }
};

@Component({
  selector: 'app-alert',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()', '[attr.role]': "tone() === 'danger' ? 'alert' : 'status'" },
  template: `
    <lucide-icon [img]="icon()" class="mt-0.5 h-4 w-4" aria-hidden="true" />
    <div class="min-w-0">
      @if (heading()) {
        <p class="font-semibold">{{ heading() }}</p>
      }
      <div [class.mt-0.5]="!!heading()"><ng-content /></div>
    </div>
  `
})
export class Alert {
  readonly tone = input<AlertTone>('info');
  readonly heading = input<string>();
  protected readonly icon = computed(() => config[this.tone()].icon);
  protected readonly classes = computed(() => cn('flex gap-2.5 rounded-md border px-3 py-2.5 text-[13px] leading-5', config[this.tone()].cls));
}

@Component({
  selector: 'app-empty-state',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col items-center px-6 py-12 text-center' },
  template: `
    @if (icon()) {
      <span class="mb-3 grid h-11 w-11 place-items-center rounded-full bg-ink-100 text-ink-500" aria-hidden="true">
        <lucide-icon [img]="icon()!" class="h-5 w-5" />
      </span>
    }
    <p class="text-sm font-semibold text-ink-900">{{ heading() }}</p>
    @if (description()) {
      <p class="mt-1 max-w-sm text-[13px] text-ink-500">{{ description() }}</p>
    }
    <div class="mt-4 empty:hidden"><ng-content /></div>
  `
})
export class EmptyState {
  readonly heading = input.required<string>();
  readonly description = input<string>();
  readonly icon = input<LucideIconData>();
}

/** Read-only label/value pair. Place inside a <dl>. */
@Component({
  selector: 'div[appValueRow]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'grid grid-cols-[132px_minmax(0,1fr)] items-center gap-3 py-1' },
  template: `
    <dt class="text-right text-[13px] text-ink-500">{{ label() }}</dt>
    <dd class="text-sm font-medium tabular-nums text-ink-900"><ng-content /></dd>
  `
})
export class ValueRow {
  readonly label = input.required<string>();
}
