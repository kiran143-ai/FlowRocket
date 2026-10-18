import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';
import { CaseStatus } from '../../core/types/workspace';
import { cn } from '../../core/utils/cn';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-ink-100 text-ink-700 ring-ink-200',
  info: 'bg-brand-50 text-brand-700 ring-brand-200',
  success: 'bg-success-50 text-success-700 ring-success-100',
  warning: 'bg-warning-50 text-warning-700 ring-warning-100',
  danger: 'bg-danger-50 text-danger-700 ring-danger-100'
};

const dots: Record<BadgeTone, string> = {
  neutral: 'bg-ink-400',
  info: 'bg-brand-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500'
};

@Component({
  selector: 'app-badge',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `
    @if (dot()) {
      <span [class]="dotClass()" aria-hidden="true"></span>
    }
    @if (icon()) {
      <lucide-icon [img]="icon()!" class="h-3 w-3" aria-hidden="true" />
    }
    <ng-content />
  `
})
export class Badge {
  readonly tone = input<BadgeTone>('neutral');
  readonly dot = input(false, { transform: booleanAttribute });
  readonly icon = input<LucideIconData>();
  protected readonly classes = computed(() =>
    cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset', tones[this.tone()])
  );
  protected readonly dotClass = computed(() => cn('h-1.5 w-1.5 rounded-full', dots[this.tone()]));
}

const statusTones: Record<CaseStatus, BadgeTone> = {
  'Ready for UW': 'info',
  'Rated*': 'warning',
  'CS Communicated': 'success'
};

@Component({
  selector: 'app-status-badge',
  imports: [Badge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-badge [tone]="tone()" dot>{{ status() }}</app-badge>`
})
export class StatusBadge {
  readonly status = input.required<CaseStatus>();
  protected readonly tone = computed(() => statusTones[this.status()]);
}
