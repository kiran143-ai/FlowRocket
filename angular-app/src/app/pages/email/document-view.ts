import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { NotFound } from '../../case/case-not-found';
import { getAttachment } from '../../core/utils/email';
import { PdfPage, PdfViewer } from '../../documents/pdf-viewer';
import { Form461Page, ScannedPage } from '../../documents/static-pages';

@Component({
  selector: 'app-document-view',
  imports: [NotFound, PdfViewer, PdfPage, Form461Page, ScannedPage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (found(); as f) {
      <h1 class="sr-only">View Documents — {{ f.attachment.title }}</h1>
      <app-pdf-viewer [fileName]="f.attachment.title + ' · ' + f.attachment.name" [pageCount]="5" backLabel="Back to email" (back)="back()" (download)="download()">
        <ng-template appPdfPage let-p>
          @if (p === 1 && isForm461()) {
            <app-form461-page />
          } @else {
            <app-scanned-page [title]="f.attachment.title" [page]="p" />
          }
        </ng-template>
      </app-pdf-viewer>
    } @else {
      <app-not-found heading="Document not found" />
    }
  `
})
export class DocumentView {
  readonly docId = input<string>();
  /** ?from=<inbox id> — where Back returns to. */
  readonly from = input<string>();
  private readonly router = inject(Router);
  protected readonly found = computed(() => getAttachment(this.docId()));
  protected readonly isForm461 = computed(() => this.found()?.email.claimantLine === 'Jon Eldridge');

  protected back(): void {
    const from = this.from() ?? this.found()?.email.inboxId;
    this.router.navigate(from ? ['/email', from] : ['/']);
  }

  protected download(): void {
    toast.success(`Downloading ${this.found()?.attachment.name}`);
  }
}
