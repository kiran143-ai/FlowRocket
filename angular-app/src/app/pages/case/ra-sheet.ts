import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SendIcon } from 'lucide-angular';
import { NotFound } from '../../case/case-not-found';
import { CaseService } from '../../core/services/case.service';
import { RaSheetService } from '../../core/services/ra-sheet.service';
import { raFileName } from '../../core/utils/raSheet';
import { PdfPage, PdfViewer } from '../../documents/pdf-viewer';
import { RaConfirmationPage } from '../../documents/ra-confirmation-page';
import { Button } from '../../shared/ui';

@Component({
  selector: 'app-ra-sheet',
  imports: [NotFound, PdfViewer, PdfPage, RaConfirmationPage, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (caseRecord(); as c) {
      <h1 class="sr-only">RA Confirmation Sheet — {{ fileName() }}</h1>
      <app-pdf-viewer [fileName]="fileName()" [pageCount]="1" backLabel="Back to Rating Activity" (back)="go('/rating')" (download)="raSheet.download(c)">
        <ng-template appPdfPage><app-ra-confirmation-page [caseRecord]="c" /></ng-template>
        <button
          toolbarExtra
          type="button"
          role="switch"
          [attr.aria-checked]="annotate()"
          (click)="annotate.set(!annotate())"
          class="focus-ring mr-1 inline-flex h-8 items-center gap-2 rounded-md px-2 text-[13px] font-medium text-white/90 hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-ink-900">
          Annotate
          <span class="relative h-4 w-7 rounded-full transition-colors duration-150" [class]="annotate() ? 'bg-warning-500' : 'bg-white/30'" aria-hidden="true">
            <span class="absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform duration-150" [class]="annotate() ? 'translate-x-3.5' : 'translate-x-0.5'"></span>
          </span>
        </button>
        <button toolbarAction appButton="ml-1" size="sm" variant="primary" [leadingIcon]="SendIcon" [disabled]="!c.rating" (click)="go('/message')">Send to broker</button>
      </app-pdf-viewer>
    } @else {
      <app-not-found />
    }
  `
})
export class RaSheet {
  readonly caseId = input<string>();
  protected readonly caseRecord = inject(CaseService).byId(this.caseId);
  protected readonly raSheet = inject(RaSheetService);
  private readonly router = inject(Router);
  protected readonly annotate = signal(false);
  protected readonly fileName = computed(() => {
    const c = this.caseRecord();
    return c ? raFileName(c) : '';
  });
  protected readonly SendIcon = SendIcon;

  protected go(path: string): void {
    this.router.navigateByUrl(`/case/${this.caseId()}${path}`);
  }
}
