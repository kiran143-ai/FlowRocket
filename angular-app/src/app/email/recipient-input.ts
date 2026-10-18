import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';
import { BookUserIcon, CopyIcon, LucideAngularModule, XIcon } from 'lucide-angular';
import { toast } from 'ngx-sonner';
import { cn } from '../core/utils/cn';
import { IconButton } from '../shared/ui';

/** Chip input for addresses. Enter or comma adds; Backspace on empty removes the last chip. */
@Component({
  selector: 'app-recipient-input',
  imports: [LucideAngularModule, IconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'grid gap-x-3 gap-y-1 sm:grid-cols-[48px_minmax(0,1fr)] sm:items-start' },
  template: `
    <label [for]="id()" class="text-[13px] font-medium text-ink-700 sm:pt-2 sm:text-right">{{ label() }}</label>
    <div>
      <div class="flex items-start gap-2">
        <button appIconButton="mt-0.5 text-brand-700" variant="outline" [label]="'Choose ' + label() + ' recipients from Address Book'" [icon]="BookUserIcon" (click)="addressBook()"></button>
        <div [class]="frameClass()">
          @for (v of values(); track v) {
            <span class="inline-flex max-w-full items-center gap-1 rounded bg-brand-50 py-0.5 pl-2 pr-1 text-xs font-medium text-brand-800 ring-1 ring-inset ring-brand-200">
              <span class="truncate">{{ v }}</span>
              <button type="button" [attr.aria-label]="'Remove ' + v" (click)="remove(v)" class="focus-ring grid h-4 w-4 place-items-center rounded text-brand-700 hover:bg-brand-100">
                <lucide-icon [img]="XIcon" class="h-3 w-3" aria-hidden="true" />
              </button>
            </span>
          }
          <input
            [id]="id()"
            [value]="draft()"
            (input)="draft.set($any($event.target).value)"
            (keydown)="onKey($event)"
            (blur)="commit()"
            [attr.aria-invalid]="error() ? true : null"
            [attr.aria-describedby]="error() ? id() + '-error' : null"
            class="h-7 min-w-[140px] flex-1 bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
            [placeholder]="values().length ? '' : 'Type an address and press Enter'" />
        </div>
        <button appIconButton="mt-0.5" [label]="'Copy ' + label() + ' recipients'" [icon]="CopyIcon" (click)="copy()"></button>
      </div>
      @if (error()) {
        <p [id]="id() + '-error'" class="ml-10 mt-1 text-xs font-medium text-danger-700">{{ error() }}</p>
      }
    </div>
  `
})
export class RecipientInput {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly values = model.required<string[]>();
  readonly error = input<string>();
  protected readonly draft = signal('');
  protected readonly BookUserIcon = BookUserIcon;
  protected readonly CopyIcon = CopyIcon;
  protected readonly XIcon = XIcon;

  protected readonly frameClass = computed(() =>
    cn(
      'flex min-h-[36px] flex-1 flex-wrap items-center gap-1.5 rounded-md border bg-white px-2 py-1 transition-[border-color,box-shadow] duration-150 focus-within:ring-2',
      this.error() ? 'border-danger-500 focus-within:ring-danger-500/25' : 'border-ink-200 focus-within:border-brand-500 focus-within:ring-brand-500/25 hover:border-ink-300'
    )
  );

  protected commit(): void {
    const v = this.draft().trim().replace(/,$/, '');
    if (!v) return;
    if (!this.values().includes(v)) this.values.set([...this.values(), v]);
    this.draft.set('');
  }

  protected onKey(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      this.commit();
    } else if (e.key === 'Backspace' && !this.draft() && this.values().length) {
      this.values.set(this.values().slice(0, -1));
    }
  }

  protected remove(v: string): void {
    this.values.set(this.values().filter((x) => x !== v));
  }

  protected copy(): void {
    navigator.clipboard?.writeText(this.values().join('; ')).catch(() => undefined);
    toast.success(`${this.label()} recipients copied`);
  }

  protected addressBook(): void {
    toast('Address Book isn’t part of this prototype.');
  }
}
