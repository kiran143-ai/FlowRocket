import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { HistoryIcon } from 'lucide-angular';
import { toast } from 'ngx-sonner';
import { ActivityWallPanel } from '../../case/activity-wall-panel';
import { CaseLayout } from '../../case/case-layout';
import { NotFound } from '../../case/case-not-found';
import { CaseOverview } from '../../case/case-overview';
import { CaseTimeline } from '../../case/case-timeline';
import { ColumnPanel } from '../../case/column-panel';
import { SummaryPanel } from '../../case/summary-panel';
import { CaseService } from '../../core/services/case.service';
import { TimelineEvent, WallEntry } from '../../core/types/case';

@Component({
  selector: 'app-activity-sheet',
  imports: [CaseLayout, NotFound, CaseOverview, CaseTimeline, ColumnPanel, SummaryPanel, ActivityWallPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (caseRecord(); as c) {
      <app-case-layout [caseRecord]="c" [heading]="'Activity Sheets Dashboard — ' + c.claimantName" hideTitle>
        <app-case-overview [caseRecord]="c" />
        <div class="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)] xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.1fr)_minmax(0,1fr)]">
          <app-column-panel heading="Timeline" tone="success" [icon]="HistoryIcon">
            <app-case-timeline [events]="c.timeline" (openLink)="openTimeline($event)" />
          </app-column-panel>
          <app-summary-panel [caseRecord]="c" />
          <app-activity-wall-panel class="lg:col-span-2 xl:col-span-1" [entries]="c.wall" (addMessage)="go('/message')" (openEntry)="openWall($event)" />
        </div>
      </app-case-layout>
    } @else {
      <app-not-found />
    }
  `
})
export class ActivitySheet {
  /** Bound from the :caseId route param. */
  readonly caseId = input<string>();
  protected readonly caseRecord = inject(CaseService).byId(this.caseId);
  private readonly router = inject(Router);
  protected readonly HistoryIcon = HistoryIcon;

  protected go(path: string): void {
    this.router.navigateByUrl(`/case/${this.caseId()}${path}`);
  }

  protected openTimeline(e: TimelineEvent): void {
    if (e.link?.endsWith('RASheet.pdf')) this.go('/ra-sheet');
    else if (e.kind === 'note') this.go('/message');
    else toast(e.link ?? '');
  }

  protected openWall(e: WallEntry): void {
    this.go(e.kind === 'email' ? '/message' : '/rating');
  }
}
