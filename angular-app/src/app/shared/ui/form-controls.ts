import { booleanAttribute, ChangeDetectionStrategy, Component, computed, Directive, ElementRef, inject, input } from '@angular/core';
import { ChevronDownIcon, CircleAlertIcon, CircleCheckIcon, LucideAngularModule, LucideIconData } from 'lucide-angular';
import { cn } from '../../core/utils/cn';

const controlBase =
  'w-full rounded-md border bg-white px-3 text-ink-900 placeholder:text-ink-400 transition-[border-color,box-shadow] duration-150 ease-out focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-400 read-only:bg-ink-50';
const controlValid = 'border-ink-200 hover:border-ink-300 focus:border-brand-500 focus:ring-brand-500/25';
const controlInvalid = 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/25';

/**
 * Styles a native <input>, <select> or <textarea>. Extra classes go in the attribute value
 * so they win Tailwind conflicts: <input appControl="w-36" />.
 */
@Directive({
  selector: 'input[appControl], select[appControl], textarea[appControl]',
  host: { '[class]': 'classes()', '[attr.aria-invalid]': 'invalid() || null' }
})
export class Control {
  readonly extra = input('', { alias: 'appControl' });
  readonly controlSize = input<'sm' | 'md'>('md');
  readonly invalid = input(false, { transform: booleanAttribute });
  private readonly isSelect = inject(ElementRef).nativeElement.tagName === 'SELECT';

  protected readonly classes = computed(() =>
    cn(
      controlBase,
      this.controlSize() === 'sm' ? 'h-8 text-[13px]' : 'h-9 text-sm',
      this.invalid() ? controlInvalid : controlValid,
      this.isSelect && 'cursor-pointer appearance-none pr-8',
      this.extra()
    )
  );
}

/**
 * Wraps a <select appControl> to draw the chevron. Size the wrapper, not the select.
 * It is a block, so it fills grid cells and stacks; give it a width (e.g. w-full, w-36) inside flex rows.
 */
@Component({
  selector: 'app-select',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative block' },
  template: `
    <ng-content />
    <lucide-icon [img]="ChevronDownIcon" class="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" aria-hidden="true" />
  `
})
export class SelectShell {
  protected readonly ChevronDownIcon = ChevronDownIcon;
}

/** Puts a decorative icon inside the left edge of a projected <input appControl="pl-8">. */
@Component({
  selector: 'app-input-icon',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative block' },
  template: `
    <span class="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-ink-400" aria-hidden="true">
      <lucide-icon [img]="icon()" class="h-4 w-4" />
    </span>
    <ng-content />
  `
})
export class InputIcon {
  readonly icon = input.required<LucideIconData>();
}

/** Label + control + hint/error message, stacked or inline. */
@Component({
  selector: 'app-field',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `
    <label [attr.for]="for()" [class]="labelClasses()">
      {{ label() }}
      @if (required()) {
        <span class="ml-0.5 text-danger-600" aria-hidden="true">*</span>
        <span class="sr-only"> (required)</span>
      }
    </label>
    <div class="min-w-0">
      <ng-content />
      @if (error()) {
        <p [id]="for() + '-error'" class="mt-1.5 flex items-center gap-1 text-xs font-medium text-danger-700">
          <lucide-icon [img]="CircleAlertIcon" class="h-3.5 w-3.5" aria-hidden="true" />
          {{ error() }}
        </p>
      } @else if (success()) {
        <p [id]="for() + '-success'" class="mt-1.5 flex items-center gap-1 text-xs font-medium text-success-700">
          <lucide-icon [img]="CircleCheckIcon" class="h-3.5 w-3.5" aria-hidden="true" />
          {{ success() }}
        </p>
      } @else if (hint()) {
        <p [id]="for() + '-hint'" class="mt-1.5 text-xs text-ink-500">{{ hint() }}</p>
      }
    </div>
  `
})
export class Field {
  readonly label = input.required<string>();
  readonly for = input.required<string>();
  readonly hint = input<string>();
  readonly error = input<string | null | undefined>();
  readonly success = input<string>();
  readonly required = input(false, { transform: booleanAttribute });
  readonly layout = input<'stacked' | 'inline'>('stacked');
  readonly extra = input('', { alias: 'fieldClass' });
  protected readonly CircleAlertIcon = CircleAlertIcon;
  protected readonly CircleCheckIcon = CircleCheckIcon;

  protected readonly classes = computed(() =>
    cn(
      this.layout() === 'inline' ? 'grid gap-x-3 gap-y-1 sm:grid-cols-[132px_minmax(0,1fr)] sm:items-start' : 'flex flex-col gap-1.5',
      this.extra()
    )
  );
  protected readonly labelClasses = computed(() =>
    cn('text-[13px] font-medium text-ink-700', this.layout() === 'inline' && 'sm:pt-2 sm:text-right')
  );
}

/** Checkbox or radio with its visible (or screen-reader-only) label. Bind the native input inside. */
@Component({
  selector: 'label[appChoice]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content select="input" /><span [class.sr-only]="srOnly()"><ng-content /></span>`
})
export class Choice {
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly srOnly = input(false, { transform: booleanAttribute });
  readonly extra = input('', { alias: 'appChoice' });
  protected readonly classes = computed(() =>
    cn('inline-flex items-center gap-2 text-sm', this.disabled() ? 'cursor-not-allowed text-ink-400' : 'cursor-pointer text-ink-900', this.extra())
  );
}

/** Class string for native checkbox/radio inputs. */
export const choiceInput = 'focus-ring h-4 w-4 shrink-0 cursor-pointer rounded accent-brand-600 disabled:cursor-not-allowed';
