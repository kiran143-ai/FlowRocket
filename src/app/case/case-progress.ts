import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { CheckIcon, LucideAngularModule } from 'lucide-angular';
import { CaseRecord } from '../core/types/case';
import { cn } from '../core/utils/cn';
import { CASE_STAGES, caseStage } from '../core/utils/raSheet';
import { Button } from '../shared/ui';
import { caseNextStep } from './next-step';

/** Evergreen case workspace: vertical progress through the workflow, with the next step beneath it. */
@Component({
  selector: 'app-case-progress',
  imports: [LucideAngularModule, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block overflow-hidden rounded-xl border border-ink-200 bg-white shadow-raised' },
  template: `
    <h2 id="case-progress-title" class="border-b border-ink-100 px-5 py-3.5 text-[15px] font-semibold text-ink-900">Case progress</h2>
    <ol aria-labelledby="case-progress-title" class="px-5 py-5">
      @for (s of stages; track s.id; let i = $index; let last = $last) {
        <li class="relative flex gap-3 pb-6 last:pb-0" [attr.aria-current]="i === stageIdx() + 1 ? 'step' : null">
          @if (!last) {
            <span class="absolute bottom-0 left-3 top-7 w-px -translate-x-1/2" [class]="i <= stageIdx() ? 'bg-brand-600' : 'bg-ink-200'" aria-hidden="true"></span>
          }
          <span [class]="markerClass(i)" aria-hidden="true">
            @if (i <= stageIdx()) {
              <lucide-icon [img]="CheckIcon" class="h-3.5 w-3.5" />
            } @else {
              {{ i + 1 }}
            }
          </span>
          <div class="min-w-0 pt-0.5">
            <p [class]="labelClass(i)">{{ s.label }}</p>
            <p class="text-xs text-ink-500">{{ i <= stageIdx() ? 'Done' : i === stageIdx() + 1 ? 'In progress' : 'Upcoming' }}</p>
          </div>
        </li>
      }
    </ol>
    <div class="border-t border-ink-100 bg-ink-50 px-5 py-4">
      <p class="text-[13px] font-semibold text-ink-900">{{ next().title }}</p>
      <p class="mt-0.5 text-xs text-ink-700">{{ next().body }}</p>
      <button appButton size="sm" class="mt-3" [variant]="next().done ? 'secondary' : 'primary'" [leadingIcon]="next().icon" (click)="go(next().to)">{{ next().cta }}</button>
    </div>
  `
})
export class CaseProgress {
  readonly caseRecord = input.required<CaseRecord>();
  private readonly router = inject(Router);
  protected readonly stages = CASE_STAGES;
  protected readonly CheckIcon = CheckIcon;
  protected readonly stageIdx = computed(() => CASE_STAGES.findIndex((s) => s.id === caseStage(this.caseRecord())));
  protected readonly next = computed(() => caseNextStep(this.caseRecord()));

  protected markerClass(i: number): string {
    const done = i <= this.stageIdx();
    const current = i === this.stageIdx() + 1;
    return cn(
      'relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold',
      done ? 'bg-brand-600 text-white' : current ? 'bg-white text-brand-700 ring-2 ring-brand-600' : 'bg-white text-ink-500 ring-1 ring-ink-300'
    );
  }

  protected labelClass(i: number): string {
    const done = i <= this.stageIdx();
    const current = i === this.stageIdx() + 1;
    return cn('text-sm', done ? 'font-medium text-ink-900' : current ? 'font-semibold text-brand-700' : 'text-ink-500');
  }

  protected go(to: string): void {
    this.router.navigateByUrl(to);
  }
}
