import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArrowLeftIcon, DownloadIcon, FileTextIcon, LucideAngularModule } from 'lucide-angular';
import { RaSheetService } from '../core/services/ra-sheet.service';
import { ThemeService } from '../core/services/theme.service';
import { CaseRecord } from '../core/types/case';
import { WindowBar } from '../layout/window-bar';
import { Badge, Button, StatusBadge } from '../shared/ui';
import { CaseToolbar } from './case-toolbar';

/**
 * Frame for every case screen: page title, status and case navigation.
 * Classic: window bar, title row and an icon toolbar. Evergreen: a case workspace header with the
 * claimant identity, key figures and tabbed case navigation.
 * Slots: [titleAction] next to the title, [headerExtra] beside the case actions.
 */
@Component({
  selector: 'app-case-layout',
  imports: [NgTemplateOutlet, RouterLink, LucideAngularModule, WindowBar, Badge, Button, StatusBadge, CaseToolbar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex min-h-[calc(100vh-88px)] flex-col eg:min-h-[calc(100vh-56px)]' },
  template: `
    <ng-template #titleActionSlot><ng-content select="[titleAction]" /></ng-template>
    <ng-template #headerExtraSlot><ng-content select="[headerExtra]" /></ng-template>
    <ng-template #bodySlot><ng-content /></ng-template>

    @if (theme.isEvergreen()) {
      @let c = caseRecord();
      @let r = c.rating;
      <div class="border-b border-ink-200 bg-white">
        <div class="px-4 pt-4 lg:px-8">
          <a routerLink="/" class="link inline-flex items-center gap-1 text-[13px]">
            <lucide-icon [img]="ArrowLeftIcon" class="h-3.5 w-3.5" aria-hidden="true" />
            Work queue
          </a>
          <div class="mt-3 flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
            <div class="flex min-w-0 items-center gap-4">
              <span class="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand-900 text-lg font-semibold text-white" aria-hidden="true">{{ c.initials }}</span>
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p class="truncate text-[22px] font-semibold leading-tight text-ink-900">{{ c.claimantName }}</p>
                  <span class="font-mono text-[13px] text-ink-500"><span class="sr-only">Case number </span>{{ c.caseNumber }}</span>
                  <app-status-badge [status]="c.status" />
                </div>
                <p class="mt-1 text-[13px] text-ink-700">{{ c.gender }} · DOB {{ c.dob }} · {{ c.ageNow }} · Broker {{ c.broker.firm }}</p>
                @if (flags().length) {
                  <div class="mt-1.5 flex flex-wrap gap-1" aria-label="Case flags">
                    @for (f of flags(); track f) {
                      <app-badge [tone]="f === 'Rush' || f === 'Rework' ? 'warning' : 'neutral'">{{ f }}</app-badge>
                    }
                  </div>
                }
              </div>
            </div>
            <dl class="flex flex-wrap gap-x-8 gap-y-3">
              <div>
                <dt class="text-xs text-ink-500">Actual age</dt>
                <dd class="mt-0.5 text-xl font-semibold tabular-nums" [class]="r ? 'text-ink-900' : 'text-ink-400'">{{ r ? r.age : '—' }}</dd>
              </div>
              <div>
                <dt class="text-xs text-ink-500">Final rated age</dt>
                <dd class="mt-0.5 text-xl font-semibold tabular-nums" [class]="r ? 'text-danger-600' : 'text-ink-400'">{{ r ? r.finalRatedAge : '—' }}</dd>
              </div>
              <div>
                <dt class="text-xs text-ink-500">Normal L.E.</dt>
                <dd class="mt-0.5 text-xl font-semibold tabular-nums" [class]="r ? 'text-ink-900' : 'text-ink-400'">{{ r ? r.normalLE.toFixed(2) : '—' }}</dd>
              </div>
              <div>
                <dt class="text-xs text-ink-500">Valid through</dt>
                <dd class="mt-0.5 text-xl font-semibold tabular-nums" [class]="r ? 'text-ink-900' : 'text-ink-400'">{{ r ? r.expirationDate : '—' }}</dd>
              </div>
            </dl>
          </div>
          <div class="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
            <div class="min-w-0 max-w-full"><app-case-toolbar [caseId]="c.caseNumber" class="block" /></div>
            <div class="flex flex-wrap items-center gap-2 pb-2">
              <ng-container *ngTemplateOutlet="headerExtraSlot" />
              @if (r) {
                <button appButton size="sm" [leadingIcon]="DownloadIcon" (click)="raSheet.download(c)">RA sheet PDF</button>
              }
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 p-4 lg:p-8">
        <div class="mb-5 flex items-center gap-2" [class.sr-only]="hideTitle()">
          <h1 class="truncate text-xl font-semibold text-ink-900">{{ heading() }}</h1>
          <ng-container *ngTemplateOutlet="titleActionSlot" />
        </div>
        <ng-container *ngTemplateOutlet="bodySlot" />
      </div>
    } @else {
      <app-window-bar [heading]="caseRecord().claimantName + ' (' + caseRecord().caseNumber + ')'" [icon]="FileTextIcon" />
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-ink-200 bg-white px-4 py-2.5 lg:px-6">
        <div class="flex min-w-0 items-center gap-1.5">
          <h1 [class]="hideTitle() ? 'sr-only' : 'truncate text-lg font-semibold text-ink-900'">{{ heading() }}</h1>
          <ng-container *ngTemplateOutlet="titleActionSlot" />
        </div>
        <div class="ml-auto flex flex-wrap items-center gap-3">
          <ng-container *ngTemplateOutlet="headerExtraSlot" />
          <app-status-badge [status]="caseRecord().status" />
          <app-case-toolbar [caseId]="caseRecord().caseNumber" />
        </div>
      </div>
      <div class="flex-1 p-4 lg:p-6"><ng-container *ngTemplateOutlet="bodySlot" /></div>
    }
  `
})
export class CaseLayout {
  readonly caseRecord = input.required<CaseRecord>();
  readonly heading = input.required<string>();
  readonly hideTitle = input(false, { transform: booleanAttribute });
  protected readonly theme = inject(ThemeService);
  protected readonly raSheet = inject(RaSheetService);
  protected readonly FileTextIcon = FileTextIcon;
  protected readonly ArrowLeftIcon = ArrowLeftIcon;
  protected readonly DownloadIcon = DownloadIcon;
  protected readonly flags = computed(() => {
    const f = this.caseRecord().flags;
    return [f.rush && 'Rush', f.rework && 'Rework', f.mediation && 'Mediation', f.msa && 'MSA', f.wc && 'WC'].filter(Boolean) as string[];
  });
}
