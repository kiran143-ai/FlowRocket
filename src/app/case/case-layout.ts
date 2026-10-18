import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FileTextIcon } from 'lucide-angular';
import { CaseRecord } from '../core/types/case';
import { WindowBar } from '../layout/window-bar';
import { StatusBadge } from '../shared/ui';
import { CaseToolbar } from './case-toolbar';

/**
 * Frame for every case screen: window bar, page title, status and case toolbar.
 * Slots: [titleAction] next to the title, [headerExtra] before the status badge.
 */
@Component({
  selector: 'app-case-layout',
  imports: [WindowBar, StatusBadge, CaseToolbar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex min-h-[calc(100vh-88px)] flex-col' },
  template: `
    <app-window-bar [heading]="caseRecord().claimantName + ' (' + caseRecord().caseNumber + ')'" [icon]="FileTextIcon" />
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-ink-200 bg-white px-4 py-2.5 lg:px-6">
      <div class="flex min-w-0 items-center gap-1.5">
        <h1 [class]="hideTitle() ? 'sr-only' : 'truncate text-lg font-semibold text-ink-900'">{{ heading() }}</h1>
        <ng-content select="[titleAction]" />
      </div>
      <div class="ml-auto flex flex-wrap items-center gap-3">
        <ng-content select="[headerExtra]" />
        <app-status-badge [status]="caseRecord().status" />
        <app-case-toolbar [caseId]="caseRecord().caseNumber" />
      </div>
    </div>
    <div class="flex-1 p-4 lg:p-6"><ng-content /></div>
  `
})
export class CaseLayout {
  readonly caseRecord = input.required<CaseRecord>();
  readonly heading = input.required<string>();
  readonly hideTitle = input(false, { transform: booleanAttribute });
  protected readonly FileTextIcon = FileTextIcon;
}
