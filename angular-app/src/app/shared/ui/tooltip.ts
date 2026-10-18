import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, inject, Injectable, input, OnDestroy } from '@angular/core';

/** One floating tooltip for the whole app, positioned next to whichever element is hovered or focused. */
@Injectable({ providedIn: 'root' })
export class TooltipService {
  private readonly doc = inject(DOCUMENT);
  private el?: HTMLDivElement;
  private timer?: ReturnType<typeof setTimeout>;
  private owner?: HTMLElement;

  show(target: HTMLElement, text: string, delay = 300): void {
    if (!text) return;
    clearTimeout(this.timer);
    this.owner = target;
    this.timer = setTimeout(() => this.place(target, text), delay);
  }

  hide(target?: HTMLElement): void {
    if (target && target !== this.owner) return;
    clearTimeout(this.timer);
    this.el?.classList.remove('fr-tooltip-visible');
    this.owner = undefined;
  }

  private place(target: HTMLElement, text: string): void {
    if (!target.isConnected) return;
    const el = (this.el ??= this.create());
    el.textContent = text;
    el.classList.add('fr-tooltip-visible');
    const r = target.getBoundingClientRect();
    const t = el.getBoundingClientRect();
    const gap = 8;
    const above = r.top - t.height - gap > 4;
    const top = above ? r.top - t.height - gap : r.bottom + gap;
    const left = Math.min(Math.max(r.left + r.width / 2 - t.width / 2, 8), window.innerWidth - t.width - 8);
    el.style.top = `${top}px`;
    el.style.left = `${left}px`;
    el.dataset['side'] = above ? 'top' : 'bottom';
  }

  private create(): HTMLDivElement {
    const el = this.doc.createElement('div');
    el.className = 'fr-tooltip';
    el.setAttribute('role', 'tooltip');
    el.setAttribute('aria-hidden', 'true');
    this.doc.body.appendChild(el);
    return el;
  }
}

/**
 * Hover/focus tooltip: <button appTooltip="Export to Excel">. With no text it falls back to the
 * element's aria-label. Visual only — screen readers use the aria-label.
 */
@Directive({
  selector: '[appTooltip]',
  host: {
    '(mouseenter)': 'show()',
    '(focusin)': 'show(0)',
    '(mouseleave)': 'hide()',
    '(focusout)': 'hide()',
    '(click)': 'hide()',
    '(keydown.escape)': 'hide()'
  }
})
export class Tooltip implements OnDestroy {
  readonly text = input('', { alias: 'appTooltip' });
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
  private readonly tooltips = inject(TooltipService);

  protected show(delay?: number): void {
    if (this.host.matches(':focus-visible') || delay === undefined) this.tooltips.show(this.host, this.text() || this.host.getAttribute('aria-label') || '', delay);
  }

  protected hide(): void {
    this.tooltips.hide(this.host);
  }

  ngOnDestroy(): void {
    this.tooltips.hide(this.host);
  }
}
