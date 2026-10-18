import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
import {
  CirclePlusIcon,
  ClipboardListIcon,
  DownloadIcon,
  FileTextIcon,
  ForwardIcon,
  HistoryIcon,
  LucideAngularModule,
  SquarePenIcon,
  TagIcon,
  Trash2Icon
} from 'lucide-angular';
import { CaseLayout } from '../../case/case-layout';
import { NotFound } from '../../case/case-not-found';
import { CaseTimeline } from '../../case/case-timeline';
import { impairmentCodes } from '../../core/data/impairmentCodes';
import { CaseService } from '../../core/services/case.service';
import { RaSheetService } from '../../core/services/ra-sheet.service';
import { WorkspaceService } from '../../core/services/workspace.service';
import { TimelineEvent } from '../../core/types/case';
import { raFileName } from '../../core/utils/raSheet';
import { Avatar, Button, EmptyState, IconButton, Modal, Panel, Tabs } from '../../shared/ui';

@Component({
  selector: 'app-rating-view',
  imports: [RouterLink, LucideAngularModule, CaseLayout, NotFound, CaseTimeline, Avatar, Button, EmptyState, IconButton, Modal, Panel, Tabs],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rating-view.html'
})
export class RatingView {
  readonly caseId = input<string>();
  protected readonly caseRecord = inject(CaseService).byId(this.caseId);
  protected readonly raSheet = inject(RaSheetService);
  private readonly ws = inject(WorkspaceService);
  private readonly router = inject(Router);

  protected readonly tab = signal('ra');
  protected readonly confirmDelete = signal(false);
  protected readonly fileName = computed(() => {
    const c = this.caseRecord();
    return c ? raFileName(c) : '';
  });
  protected readonly tabs = [
    { id: 'ra', label: 'RA Confirmation Sheet', icon: FileTextIcon },
    { id: 'timeline', label: 'Timeline', icon: HistoryIcon }
  ];
  protected readonly i = { CirclePlusIcon, ClipboardListIcon, DownloadIcon, FileTextIcon, ForwardIcon, SquarePenIcon, TagIcon, Trash2Icon };

  protected codeLabel(code: string): string | undefined {
    return impairmentCodes.find((c) => c.code === code)?.label;
  }

  protected secondaryLabels(codes: string[]): string {
    return codes.length ? codes.map((c) => this.codeLabel(c)).join('; ') : 'No Records';
  }

  protected underwriterName(name: string): string {
    return name.replace(/\s*\(\d+\)$/, '');
  }

  protected go(path: string): void {
    this.router.navigateByUrl(`/case/${this.caseId()}${path}`);
  }

  protected openTimeline(e: TimelineEvent): void {
    if (e.link?.endsWith('RASheet.pdf')) this.go('/ra-sheet');
    else toast(e.link ?? '');
  }

  protected deleteRating(): void {
    this.ws.saveRating(this.caseId()!, null);
    this.confirmDelete.set(false);
    toast.success('Rating activity deleted');
  }
}
