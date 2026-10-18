import { ChangeDetectionStrategy, Component, effect, ElementRef, input, output, viewChild } from '@angular/core';
import { LucideAngularModule, XIcon } from 'lucide-angular';
import { IconButton } from './icon-button';

let nextId = 0;
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Confirmation / short-task dialog. Traps focus, closes on Esc, returns focus on close.
 * Footer buttons go in an element marked `modalFooter`.
 */
@Component({
  selector: 'app-modal',
  imports: [IconButton, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown)': 'onKey($event)' },
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-ink-900/40" animate.enter="fr-backdrop-enter" animate.leave="fr-backdrop-leave" (click)="closed.emit()" aria-hidden="true"></div>
        <div
          #panel
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="titleId"
          [attr.aria-describedby]="description() ? descId : null"
          animate.enter="fr-dialog-enter"
          animate.leave="fr-dialog-leave"
          class="relative w-full max-w-md rounded-xl border border-ink-200 bg-white shadow-overlay">
          <div class="flex items-start justify-between gap-4 px-5 pt-5">
            <div>
              <h2 [id]="titleId" class="text-base font-semibold text-ink-900">{{ heading() }}</h2>
              @if (description()) {
                <p [id]="descId" class="mt-1 text-sm text-ink-500">{{ description() }}</p>
              }
            </div>
            <button appIconButton="-mr-1 -mt-1" label="Close dialog" size="sm" [icon]="XIcon" (click)="closed.emit()"></button>
          </div>
          <div class="px-5 pt-4 empty:hidden"><ng-content /></div>
          <div class="mt-5 flex justify-end gap-2 rounded-b-xl border-t border-ink-100 bg-ink-50 px-5 py-3">
            <ng-content select="[modalFooter]" />
          </div>
        </div>
      </div>
    }
  `
})
export class Modal {
  readonly open = input(false);
  readonly heading = input.required<string>();
  readonly description = input<string>();
  readonly closed = output<void>();

  protected readonly XIcon = XIcon;
  protected readonly titleId = `modal-title-${++nextId}`;
  protected readonly descId = `modal-desc-${nextId}`;
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private previousFocus: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const el = this.panel()?.nativeElement;
      if (el) {
        this.previousFocus = document.activeElement as HTMLElement | null;
        // Skip the close button so focus lands on the first real action.
        setTimeout(() => {
          const list = this.focusables();
          (list[1] ?? list[0])?.focus();
        }, 20);
      } else if (this.previousFocus) {
        this.previousFocus.focus();
        this.previousFocus = null;
      }
    });
  }

  protected onKey(e: KeyboardEvent): void {
    if (!this.open()) return;
    if (e.key === 'Escape') this.closed.emit();
    if (e.key !== 'Tab') return;
    const list = this.focusables();
    if (!list.length) return;
    const [first, last] = [list[0], list[list.length - 1]];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  private focusables(): HTMLElement[] {
    const el = this.panel()?.nativeElement;
    return el ? Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((x) => !x.hasAttribute('disabled')) : [];
  }
}
