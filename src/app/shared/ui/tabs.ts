import { ChangeDetectionStrategy, Component, ElementRef, input, model, viewChildren } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIconData;
  /** Optional count shown as a pill beside the label. */
  count?: number;
}

/** Underline tabs with arrow/Home/End keyboard support. Panels use id `${idPrefix}-panel-${id}`. */
@Component({
  selector: 'app-tabs',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'tablist', class: 'flex gap-1 border-b border-ink-200', '[attr.aria-label]': 'label()' },
  template: `
    @for (item of items(); track item.id; let i = $index) {
      <button
        #tab
        type="button"
        role="tab"
        [id]="idPrefix() + '-tab-' + item.id"
        [attr.aria-selected]="item.id === value()"
        [attr.aria-controls]="idPrefix() + '-panel-' + item.id"
        [tabIndex]="item.id === value() ? 0 : -1"
        (click)="value.set(item.id)"
        (keydown)="onKey($event, i)"
        class="focus-ring -mb-px inline-flex items-center gap-1.5 whitespace-nowrap rounded-t-md border-b-2 px-3 py-2 text-[13px] font-medium transition-colors duration-150"
        [class]="item.id === value() ? 'border-brand-600 text-brand-700' : 'border-transparent text-ink-500 hover:border-ink-300 hover:text-ink-900'">
        @if (item.icon) {
          <lucide-icon [img]="item.icon" class="h-4 w-4" aria-hidden="true" />
        }
        {{ item.label }}
        @if (item.count !== undefined) {
          <span class="rounded-full bg-ink-100 px-1.5 py-px text-[11px] font-semibold tabular-nums text-ink-700" [attr.aria-label]="item.count + ' items'">{{ item.count }}</span>
        }
      </button>
    }
  `
})
export class Tabs {
  readonly items = input.required<TabItem[]>();
  readonly value = model.required<string>();
  readonly label = input.required<string>();
  readonly idPrefix = input.required<string>();
  private readonly tabs = viewChildren<ElementRef<HTMLButtonElement>>('tab');

  protected onKey(e: KeyboardEvent, index: number): void {
    const n = this.items().length;
    const next = { ArrowRight: (index + 1) % n, ArrowLeft: (index - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    this.value.set(this.items()[next].id);
    this.tabs()[next]?.nativeElement.focus();
  }
}
