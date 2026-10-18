import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, contentChild, Directive, ElementRef, inject, input, output, signal, TemplateRef, viewChild, viewChildren } from '@angular/core';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, DownloadIcon, FileTextIcon, LucideAngularModule, PanelLeftIcon, PrinterIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-angular';
import { cn } from '../core/utils/cn';
import { IconButton } from '../shared/ui';

/** Page renderer: <ng-template appPdfPage let-page>…</ng-template> */
@Directive({ selector: 'ng-template[appPdfPage]' })
export class PdfPage {
  readonly template = inject<TemplateRef<{ $implicit: number }>>(TemplateRef);
}

const ZOOMS = [50, 75, 100, 125, 150];
const darkBtn = 'focus-visible:ring-white focus-visible:ring-offset-ink-900';

/** Full-height document viewer. Toolbar slots: [toolbarExtra] before Download, [toolbarAction] at the end. */
@Component({
  selector: 'app-pdf-viewer',
  imports: [NgTemplateOutlet, LucideAngularModule, IconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pdf-viewer.html',
  host: { class: 'flex h-[calc(100vh-88px)] flex-col' }
})
export class PdfViewer {
  readonly fileName = input.required<string>();
  readonly pageCount = input.required<number>();
  readonly backLabel = input.required<string>();
  readonly back = output<void>();
  readonly download = output<void>();

  protected readonly pageTpl = contentChild.required(PdfPage);
  private readonly scroller = viewChild.required<ElementRef<HTMLElement>>('scroller');
  private readonly pageEls = viewChildren<ElementRef<HTMLElement>>('pageEl');

  protected readonly page = signal(1);
  protected readonly draft = signal('1');
  protected readonly zoom = signal(100);
  protected readonly thumbs = signal(true);
  protected readonly pages = computed(() => Array.from({ length: this.pageCount() }, (_, i) => i + 1));
  protected readonly zoomIdx = computed(() => ZOOMS.indexOf(this.zoom()));

  protected readonly darkBtn = darkBtn;
  protected readonly i = { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, DownloadIcon, FileTextIcon, PanelLeftIcon, PrinterIcon, ZoomInIcon, ZoomOutIcon };

  protected goTo(p: number): void {
    const n = Math.min(Math.max(p, 1), this.pageCount());
    this.page.set(n);
    this.draft.set(String(n));
    this.pageEls()[n - 1]?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected onScroll(): void {
    const top = this.scroller().nativeElement.getBoundingClientRect().top;
    let best = 1;
    this.pageEls().forEach((el, i) => {
      if (el.nativeElement.getBoundingClientRect().top - top <= 160) best = i + 1;
    });
    if (best !== this.page()) {
      this.page.set(best);
      this.draft.set(String(best));
    }
  }

  protected setZoom(delta: number): void {
    this.zoom.set(ZOOMS[this.zoomIdx() + delta]);
  }

  protected print(): void {
    window.print();
  }

  protected thumbClass = (p: number) =>
    cn('focus-ring block w-full rounded-md p-1.5 text-center transition-colors duration-150 focus-visible:ring-offset-ink-800', p === this.page() ? 'bg-brand-600/40 ring-2 ring-brand-300' : 'hover:bg-white/10');
  protected readonly ZOOM_MAX = ZOOMS.length - 1;
}
