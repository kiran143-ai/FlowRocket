import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';
import { cn } from '../../core/utils/cn';
import { Tooltip } from './tooltip';

const variants = {
  ghost: 'text-ink-500 hover:bg-ink-100 hover:text-ink-900 active:bg-ink-200',
  outline: 'border border-ink-200 bg-white text-ink-700 shadow-xs hover:border-ink-300 hover:bg-ink-50 active:bg-ink-100',
  onBrand: 'text-white/90 hover:bg-white/15 hover:text-white active:bg-white/20 focus-visible:ring-white focus-visible:ring-offset-brand-700',
  danger: 'text-danger-600 hover:bg-danger-50 hover:text-danger-700 active:bg-danger-100'
};

/** Icon-only button. `label` is the accessible name and the tooltip; pass `tip` for shorter tooltip text. */
@Component({
  selector: 'button[appIconButton]',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: Tooltip, inputs: ['appTooltip: tip'] }],
  host: {
    type: 'button',
    '[class]': 'classes()',
    '[attr.aria-label]': 'label()'
  },
  template: `<lucide-icon [img]="icon()" class="h-4 w-4" aria-hidden="true" /><ng-content />`
})
export class IconButton {
  readonly label = input.required<string>();
  readonly icon = input.required<LucideIconData>();
  readonly variant = input<keyof typeof variants>('ghost');
  readonly size = input<'sm' | 'md'>('md');

  /** Extra classes, merged with Tailwind conflict resolution: appXxx="ml-1 text-brand-600". */
  readonly extra = input('', { alias: 'appIconButton' });

  protected readonly classes = computed(() =>
    cn(
      'focus-ring relative inline-flex shrink-0 items-center justify-center rounded-md transition-[background-color,border-color,color] duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50',
      variants[this.variant()],
      this.size() === 'sm' ? 'h-7 w-7' : 'h-8 w-8',
      this.extra()
    )
  );
}
