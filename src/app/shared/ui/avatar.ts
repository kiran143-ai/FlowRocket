import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/utils/cn';

const tones = {
  brand: 'bg-brand-600 text-white',
  danger: 'bg-danger-600 text-white',
  warning: 'bg-warning-600 text-white',
  neutral: 'bg-ink-100 text-ink-700'
};

const sizes = { sm: 'h-7 w-7 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-14 w-14 text-lg', xl: 'h-20 w-20 text-2xl' };

@Component({
  selector: 'app-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', '[class]': 'classes()' },
  template: `{{ initials() }}`
})
export class Avatar {
  readonly initials = input.required<string>();
  readonly tone = input<keyof typeof tones>('brand');
  readonly size = input<keyof typeof sizes>('md');
  protected readonly classes = computed(() =>
    cn('inline-grid shrink-0 select-none place-items-center rounded-full font-semibold', tones[this.tone()], sizes[this.size()])
  );
}
