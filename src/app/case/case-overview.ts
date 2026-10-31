import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { CheckIcon, DownloadIcon, LucideAngularModule } from 'lucide-angular';
import { RaSheetService } from '../core/services/ra-sheet.service';
import { CaseRecord } from '../core/types/case';
import { cn } from '../core/utils/cn';
import { CASE_STAGES, caseStage } from '../core/utils/raSheet';
import { Avatar, Badge, Button } from '../shared/ui';
import { caseNextStep } from './next-step';

/** Activity Sheet header: who, key figures, progress through the workflow, and the next step. */
@Component({
  selector: 'app-case-overview',
  imports: [LucideAngularModule, Avatar, Badge, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './case-overview.html'
})
export class CaseOverview {
  readonly caseRecord = input.required<CaseRecord>();
  private readonly router = inject(Router);
  protected readonly raSheet = inject(RaSheetService);

  protected readonly stages = CASE_STAGES;
  protected readonly stageIdx = computed(() => CASE_STAGES.findIndex((s) => s.id === caseStage(this.caseRecord())));
  protected readonly flags = computed(() => {
    const f = this.caseRecord().flags;
    return [f.rush && 'Rush', f.rework && 'Rework', f.mediation && 'Mediation', f.msa && 'MSA', f.wc && 'WC'].filter(Boolean) as string[];
  });

  protected readonly next = computed(() => caseNextStep(this.caseRecord()));
  protected readonly CheckIcon = CheckIcon;
  protected readonly DownloadIcon = DownloadIcon;

  protected go(to: string): void {
    this.router.navigateByUrl(to);
  }

  protected stepClass(i: number): string {
    const done = i <= this.stageIdx();
    const current = i === this.stageIdx() + 1;
    return cn(
      'grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold',
      done ? 'bg-success-600 text-white' : current ? 'bg-white text-brand-700 ring-2 ring-brand-500' : 'bg-white text-ink-400 ring-1 ring-ink-200'
    );
  }

  protected labelClass(i: number): string {
    const done = i <= this.stageIdx();
    const current = i === this.stageIdx() + 1;
    return cn('ml-2 text-[13px]', done ? 'font-medium text-ink-900' : current ? 'font-semibold text-brand-700' : 'text-ink-500');
  }
}
