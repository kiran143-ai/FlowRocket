import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CaseRecord } from '../core/types/case';
import { raFileName } from '../core/utils/raSheet';
import { NYL_LOGO_URL, raSheetContent } from '../core/utils/raSheetPdf';

/** Letter-size (816 × 1056 px) preview; core/utils/raSheetPdf.ts draws the same layout for download. */
@Component({
  selector: 'app-ra-confirmation-page',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ra-confirmation-page.html',
  host: { class: 'flex min-h-[1056px] flex-col text-ink-900' }
})
export class RaConfirmationPage {
  readonly caseRecord = input.required<CaseRecord>();
  protected readonly logoUrl = NYL_LOGO_URL;
  protected readonly content = computed(() => raSheetContent(this.caseRecord()));
  protected readonly fileName = computed(() => raFileName(this.caseRecord()));
  protected readonly hero = computed(() => {
    const r = this.caseRecord().rating;
    return r
      ? [
          ['Actual age', String(r.age)],
          ['Years rated up', `+${r.finalRatedAge - r.age}`],
          ['Normal L.E.', `${r.normalLE.toFixed(2)} yrs`],
          ['Estimated L.E.', `${r.estimatedLE.toFixed(2)} yrs`]
        ]
      : [];
  });
}
