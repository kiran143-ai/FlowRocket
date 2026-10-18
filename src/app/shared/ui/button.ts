import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LoaderCircleIcon, LucideAngularModule, LucideIconData } from 'lucide-angular';
import { cn } from '../../core/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'destructive';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-white shadow-xs hover:bg-brand-700 active:bg-brand-800',
  secondary: 'border border-ink-200 bg-white text-ink-900 shadow-xs hover:border-ink-300 hover:bg-ink-50 active:bg-ink-100',
  ghost: 'text-ink-700 hover:bg-ink-100 hover:text-ink-900 active:bg-ink-200',
  danger: 'border border-danger-200 bg-white text-danger-700 shadow-xs hover:border-danger-500 hover:bg-danger-50 active:bg-danger-100',
  destructive: 'bg-danger-600 text-white shadow-xs hover:bg-danger-700 active:bg-danger-700'
};

const sizes = { sm: 'h-8 gap-1.5 px-3 text-[13px]', md: 'h-9 gap-2 px-4 text-sm' };

/** Usage: <button appButton variant="primary" [leadingIcon]="SaveIcon">Save</button> */
@Component({
  selector: 'button[appButton]',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[disabled]': 'disabled() || loading()',
    '[attr.aria-busy]': 'loading() || null',
    '[attr.type]': 'type()'
  },
  template: `
    @if (loading()) {
      <lucide-icon [img]="LoaderIcon" class="h-4 w-4 animate-spin" aria-hidden="true" />
    } @else if (leadingIcon()) {
      <lucide-icon [img]="leadingIcon()!" class="h-4 w-4" aria-hidden="true" />
    }
    <span><ng-content /></span>
    @if (!loading() && trailingIcon()) {
      <lucide-icon [img]="trailingIcon()!" class="h-4 w-4" aria-hidden="true" />
    }
  `
})
export class Button {
  readonly variant = input<ButtonVariant>('secondary');
  readonly size = input<'sm' | 'md'>('md');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly type = input<'button' | 'submit'>('button');
  readonly leadingIcon = input<LucideIconData>();
  readonly trailingIcon = input<LucideIconData>();
  protected readonly LoaderIcon = LoaderCircleIcon;

  /** Extra classes, merged with Tailwind conflict resolution: appXxx="ml-1 text-brand-600". */
  readonly extra = input('', { alias: 'appButton' });

  protected readonly classes = computed(() =>
    cn(
      'focus-ring inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md font-medium transition-[background-color,border-color,color,box-shadow] duration-150 ease-out disabled:cursor-not-allowed',
      variants[this.variant()],
      sizes[this.size()],
      this.disabled() && !this.loading() && 'opacity-50',
      this.loading() && 'cursor-progress',
      this.extra()
    )
  );
}
