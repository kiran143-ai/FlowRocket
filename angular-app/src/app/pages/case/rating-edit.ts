import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CalculatorIcon, CircleMinusIcon, CirclePlusIcon, CircleXIcon, InfoIcon, LucideAngularModule, SaveIcon, StickyNoteIcon } from 'lucide-angular';
import { toast } from 'ngx-sonner';
import { CaseLayout } from '../../case/case-layout';
import { NotFound } from '../../case/case-not-found';
import { impairmentCodes } from '../../core/data/impairmentCodes';
import { multMethods, underwriters } from '../../core/data/underwriters';
import { CaseService } from '../../core/services/case.service';
import { WorkspaceService } from '../../core/services/workspace.service';
import { RatingValues } from '../../core/types/case';
import { nearestAge, parseUSDate } from '../../core/utils/date';
import { calculateRating, RatingResult } from '../../core/utils/rating';
import { RichTextEditor } from '../../email/rich-text-editor';
import { Cell, Column, DataTable } from '../../shared/data-table';
import { Alert, Button, Control, Field, IconButton, Modal, Panel, SelectShell, ValueRow } from '../../shared/ui';
import { Tooltip } from '../../shared/ui/tooltip';

type RatingErrors = Partial<Record<'dateEvaluated' | 'mult' | 'responseDate' | 'expirationDate' | 'calc', string>>;

@Component({
  selector: 'app-rating-edit',
  imports: [Tooltip, NgTemplateOutlet, FormsModule, LucideAngularModule, CaseLayout, NotFound, RichTextEditor, DataTable, Cell, Alert, Button, Control, Field, IconButton, Modal, Panel, SelectShell, ValueRow],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rating-edit.html'
})
export class RatingEdit {
  readonly caseId = input<string>();
  protected readonly caseRecord = inject(CaseService).byId(this.caseId);
  private readonly ws = inject(WorkspaceService);
  private readonly router = inject(Router);

  // Form state (seeded from the saved rating whenever the case changes).
  protected dateEvaluated = '04/01/2026';
  protected multMethod = 'AT';
  protected mult = '100';
  protected underwriter = underwriters[1];
  protected responseDate = '04/01/2026';
  protected expirationDate = '04/01/2027';
  protected primaryCode = impairmentCodes[0].code;
  protected readonly secondaryCodes = signal<string[]>([]);
  protected note: string[] = [];
  protected readonly results = signal<RatingResult | null>(null);
  protected readonly finalRatedAge = signal<number | null>(null);
  protected readonly errors = signal<RatingErrors>({});
  protected readonly calculating = signal(false);
  protected readonly saving = signal<'save' | 'note' | null>(null);
  protected readonly addOpen = signal(false);
  protected codeToAdd = impairmentCodes[1].code;
  protected noteHtml = '';

  protected readonly age = computed(() => {
    const c = this.caseRecord();
    if (!c) return 0;
    const dob = parseUSDate(c.dob);
    return c.rating?.age ?? (dob ? nearestAge(dob) : 0);
  });

  protected readonly ratedUp = computed(() => {
    const r = this.results();
    const f = this.finalRatedAge();
    return r && f !== null ? `${r.ratedAge - this.age()} / ${f - this.age()}` : '— / —';
  });

  protected readonly underwriters = underwriters;
  protected readonly multMethods = multMethods;
  protected readonly impairmentCodes = impairmentCodes;
  protected readonly secondaryColumns: Column<string>[] = [
    { key: 'code', header: 'Impairment Code', sortValue: (r) => r, value: (r) => this.codeLabel(r) },
    { key: 'remove', header: 'Remove', hideHeaderLabel: true, className: 'w-12' }
  ];
  protected readonly codeId = (r: string) => r;
  protected readonly codeText = (r: string) => this.codeLabel(r);
  protected readonly i = { CalculatorIcon, CircleMinusIcon, CirclePlusIcon, CircleXIcon, InfoIcon, SaveIcon, StickyNoteIcon };

  constructor() {
    effect(() => {
      const r = this.caseRecord()?.rating;
      untracked(() => {
        if (!r) return;
        this.dateEvaluated = r.dateEvaluated;
        this.multMethod = r.multMethod;
        this.mult = String(r.mult);
        this.underwriter = r.underwriter;
        this.responseDate = r.responseDate;
        this.expirationDate = r.expirationDate;
        this.primaryCode = r.primaryImpairmentCode;
        this.secondaryCodes.set(r.secondaryImpairmentCodes);
        this.note = r.note;
        this.noteHtml = r.note.join('<br>');
        this.results.set({ normalLE: r.normalLE, normalLE75: r.normalLE75, estimatedLE: r.estimatedLE, ratedAge: r.calculatedRatedAge });
        this.finalRatedAge.set(r.finalRatedAge);
      });
    });
  }

  protected codeLabel(code: string): string {
    return impairmentCodes.find((i) => i.code === code)?.label ?? code;
  }

  protected fmt(n: number | null | undefined): string {
    return n == null ? '—' : n.toFixed(2);
  }

  protected clearError(key: keyof RatingErrors): void {
    this.errors.update((e) => ({ ...e, [key]: undefined }));
  }

  protected removeCode(code: string): void {
    this.secondaryCodes.update((list) => list.filter((x) => x !== code));
  }

  protected addCode(): void {
    if (!this.secondaryCodes().includes(this.codeToAdd)) this.secondaryCodes.update((l) => [...l, this.codeToAdd]);
    this.addOpen.set(false);
  }

  protected adjustFinal(delta: number): void {
    this.finalRatedAge.update((f) => (f === null ? f : Math.max(this.age(), Math.min(100, f + delta))));
  }

  protected calculate(): void {
    const c = this.caseRecord();
    if (!c) return;
    const m = Number(this.mult);
    const next: RatingErrors = {};
    if (!parseUSDate(this.dateEvaluated)) next.dateEvaluated = 'Use the format MM/DD/YYYY.';
    if (!this.mult.trim() || Number.isNaN(m) || m < 25 || m > 1000) next.mult = 'Enter a multiplier between 25 and 1000.';
    this.errors.set(next);
    if (Object.keys(next).length) return;
    this.calculating.set(true);
    setTimeout(() => {
      const res = calculateRating(this.age(), c.gender, m);
      this.results.set(res);
      this.finalRatedAge.set(res.ratedAge);
      this.calculating.set(false);
      toast.success(`Rated age calculated: ${res.ratedAge}`, { description: `Normal L.E. ${res.normalLE.toFixed(2)} · Estimated L.E. ${res.estimatedLE.toFixed(2)}` });
    }, 700);
  }

  private buildValues(): RatingValues | null {
    const res = this.results();
    const final = this.finalRatedAge();
    if (!res || final === null) return null;
    return {
      dateEvaluated: this.dateEvaluated,
      multMethod: this.multMethod,
      mult: Number(this.mult),
      age: this.age(),
      normalLE: res.normalLE,
      normalLE75: res.normalLE75,
      estimatedLE: res.estimatedLE,
      calculatedRatedAge: res.ratedAge,
      finalRatedAge: final,
      responseDate: this.responseDate,
      expirationDate: this.expirationDate,
      underwriter: this.underwriter,
      primaryImpairmentCode: this.primaryCode,
      secondaryImpairmentCodes: this.secondaryCodes(),
      note: this.note
    };
  }

  protected save(): void {
    const c = this.caseRecord();
    if (!c || this.saving()) return;
    const next: RatingErrors = {};
    if (!parseUSDate(this.dateEvaluated)) next.dateEvaluated = 'Use the format MM/DD/YYYY.';
    if (!parseUSDate(this.responseDate)) next.responseDate = 'Use the format MM/DD/YYYY.';
    if (!parseUSDate(this.expirationDate)) next.expirationDate = 'Use the format MM/DD/YYYY.';
    if (!this.results()) next.calc = 'Calculate the rated age before saving.';
    this.errors.set(next);
    const values = this.buildValues();
    if (Object.keys(next).length || !values) return;
    this.saving.set('save');
    setTimeout(() => {
      this.ws.saveRating(c.caseNumber, values);
      this.ws.setCaseStatus(c.caseNumber, 'Rated*');
      this.saving.set(null);
      toast.success('Rating activity saved', { description: `${c.claimantName} · Final Rated Age ${values.finalRatedAge}` });
      this.router.navigate(['/case', c.caseNumber, 'rating']);
    }, 700);
  }

  protected saveNote(): void {
    const c = this.caseRecord();
    if (!c || this.saving()) return;
    this.saving.set('note');
    setTimeout(() => {
      if (c.rating) this.ws.saveRating(c.caseNumber, { ...c.rating, note: this.note });
      this.saving.set(null);
      toast.success('Underwriter note saved');
    }, 500);
  }

  protected cancel(): void {
    this.router.navigate(['/case', this.caseId(), 'rating']);
  }

  protected onNote(text: string): void {
    this.note = text.split('\n').filter((l) => l.trim());
  }
}
