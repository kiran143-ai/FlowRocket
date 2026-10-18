import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

const widths = ['100%', '94%', '97%', '88%', '100%', '72%', '0', '100%', '91%', '96%', '84%', '0', '100%', '93%', '60%'];

/** Placeholder for a scanned medical-record page. */
@Component({
  selector: 'app-scanned-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-h-[1056px] px-16 py-14 font-serif text-[13px] text-black' },
  template: `
    <div class="flex justify-between text-xs">
      <span>{{ title().toUpperCase() }}</span>
      <span>Page {{ page() }}</span>
    </div>
    <div class="mt-10 space-y-3" aria-hidden="true">
      @for (block of [0, 1, 2]; track block) {
        <div class="space-y-2.5 pb-6">
          @for (w of widths; track $index) {
            <span class="block h-2 rounded-sm bg-ink-200" [style.width]="w"></span>
          }
        </div>
      }
    </div>
    <p class="sr-only">Scanned page {{ page() }} of {{ title() }}.</p>
  `
})
export class ScannedPage {
  readonly title = input.required<string>();
  readonly page = input.required<number>();
  protected readonly widths = widths;
}

const parties: [string, string[]][] = [
  ['Judge:', ['MICHAEL E WILLIAMS']],
  ['Employee:', ['ELDRIDGE, JON', 'TAUNTON, MA 02780     5082151813']],
  ["Employee's Attorney:", ['RONALD W STOIA ESQ', 'BROCKTON, MA 02302     508-588-4553']],
  ['Employer:', ['RJV CONSTRUCTION CORP']],
  ['Insurance Company:', ['HARTFORD ACCIDENT AND INDEMNITY']],
  ["Insurer's Attorney:", ['ROGER J DOUCETTE']],
  ['Date of Injury:', ['08/15/2019']],
  ['Board Number:', ['2077619']],
  ['Region of Conference:', ['FALL RIVER']]
];

/** Page 1 of the Jon Eldridge attachment: Massachusetts DIA Form 461. */
@Component({
  selector: 'app-form461-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-h-[1056px] px-16 py-14 font-serif text-[13px] leading-relaxed text-black' },
  template: `
    <ng-template #box let-checked>
      <span class="ml-2 inline-grid h-3.5 w-3.5 place-items-center border border-black align-middle text-[10px] leading-none" [attr.aria-label]="checked ? 'checked' : 'unchecked'">{{ checked ? 'X' : '' }}</span>
    </ng-template>
    <div class="flex justify-between font-semibold">
      <span>FORM 461</span>
      <span>PRINTED 08/11/2022</span>
    </div>
    <h2 class="mt-8 text-center text-[14px] font-bold">CONFLICT DISCLOSURE FORM TO BE COMPLETED BY PHYSICIAN</h2>
    <dl class="mt-8 grid grid-cols-[200px_1fr] gap-y-1">
      @for (p of parties; track p[0]) {
        <dt class="font-bold">{{ p[0] }}</dt>
        <dd class="whitespace-pre">{{ p[1].join('\\n') }}</dd>
      }
    </dl>
    <div class="mt-8 space-y-2">
      <p>I.P.E. SELECTION OR SPECIALTY CODE: <span class="underline">NEURO</span></p>
      <p>BODY PART: <span class="underline">HEAD, CERVICAL, LEFT SHOULDER</span></p>
      <p class="flex justify-between">
        <span>CHECK IF I.P.E. SELECTED BY PARTIES <ng-container *ngTemplateOutlet="box; context: { $implicit: true }" /></span>
        <span>OR JUDGE APPOINTED <ng-container *ngTemplateOutlet="box; context: { $implicit: false }" /></span>
      </p>
      <p>SECOND I.P.E. SELECTION OR SPECIALTY CODE:</p>
      <p class="flex justify-between">
        <span>APPROVED BY JUDGE <ng-container *ngTemplateOutlet="box; context: { $implicit: false }" /></span>
        <span>RESPONSIBLE PAYING PARTY <ng-container *ngTemplateOutlet="box; context: { $implicit: false }" /></span>
      </p>
    </div>
    <div class="mt-10 border-t border-black pt-4">
      <p class="font-bold">TO BE COMPLETED BY THE IMPARTIAL PHYSICIAN</p>
      <p class="mt-2">I have reviewed the names of the parties listed above and certify that I have no conflict of interest with respect to any party to this proceeding.</p>
      <div class="mt-10 grid grid-cols-2 gap-10">
        <p class="border-t border-black pt-1">Physician Signature</p>
        <p class="border-t border-black pt-1">Date</p>
      </div>
    </div>
  `,
  imports: [NgTemplateOutlet]
})
export class Form461Page {
  protected readonly parties = parties;
}
