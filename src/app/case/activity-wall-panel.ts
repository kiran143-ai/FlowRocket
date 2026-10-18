import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ChevronDownIcon,
  FilterIcon,
  HeartPulseIcon,
  LucideAngularModule,
  MailIcon,
  MessageSquareIcon,
  MessageSquarePlusIcon,
  PaperclipIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  StickyNoteIcon
} from 'lucide-angular';
import { toast } from 'ngx-sonner';
import { WallEntry } from '../core/types/case';
import { Control, IconButton, InputIcon } from '../shared/ui';
import { ColumnPanel } from './column-panel';
import { Tooltip } from '../shared/ui/tooltip';

@Component({
  selector: 'app-activity-wall-panel',
  imports: [Tooltip, ColumnPanel, LucideAngularModule, IconButton, FormsModule, Control, InputIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-column-panel heading="Activity Wall" tone="brand" [icon]="i.MessageSquareIcon">
      <div columnActions class="flex items-center gap-0.5">
        <button appIconButton label="Add message" size="sm" [icon]="i.PlusIcon" (click)="addMessage.emit()"></button>
        <button appIconButton label="Add comment" size="sm" [icon]="i.MessageSquarePlusIcon" (click)="addMessage.emit()"></button>
        <button appIconButton label="Filter" size="sm" [icon]="i.FilterIcon" (click)="notAvailable()"></button>
        <button appIconButton label="Refresh" size="sm" [icon]="i.RefreshCwIcon" (click)="refreshed()"></button>
        <button appIconButton [label]="searching() ? 'Close search' : 'Search activity'" [attr.aria-expanded]="searching()" size="sm" [icon]="i.SearchIcon" (click)="searching.set(!searching())"></button>
      </div>

      @if (searching()) {
        <app-input-icon [icon]="i.SearchIcon" class="mb-4">
          <input appControl="pl-8" controlSize="sm" type="search" aria-label="Search Activity Wall" placeholder="Search activity" [ngModel]="query()" (ngModelChange)="query.set($event)" />
        </app-input-icon>
      }

      <div class="flex justify-center">
        <button type="button" [attr.aria-expanded]="monthOpen()" (click)="monthOpen.set(!monthOpen())" class="focus-ring inline-flex items-center gap-1 rounded-full bg-success-700 px-3 py-1 text-xs font-semibold text-white transition-colors duration-150 hover:bg-success-600">
          <lucide-icon [img]="i.ChevronDownIcon" [class]="'h-3.5 w-3.5 transition-transform duration-150' + (monthOpen() ? '' : ' -rotate-90')" aria-hidden="true" />
          April 2026
        </button>
      </div>

      @if (monthOpen()) {
        @if (visible().length) {
          <ol class="relative mt-4 space-y-4 before:absolute before:bottom-3 before:left-[15px] before:top-3 before:w-px before:bg-ink-200">
            @for (e of visible(); track e.id) {
              <li class="relative flex gap-3">
                <span class="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink-200 bg-white">
                  @if (e.kind === 'email') {
                    <lucide-icon [img]="i.MailIcon" class="h-4 w-4 text-warning-600" aria-hidden="true" />
                  } @else {
                    <lucide-icon [img]="i.StickyNoteIcon" class="h-4 w-4 text-brand-600" aria-hidden="true" />
                  }
                </span>
                <div class="min-w-0 flex-1 pt-0.5">
                  <p class="text-[13px] text-ink-700">
                    {{ e.label }} <span class="font-medium text-success-700">{{ e.at }}</span>
                  </p>
                  <button type="button" (click)="openEntry.emit(e)" class="link text-left text-[13px]">{{ e.subject }}</button>
                  <p class="text-xs text-ink-500">by {{ e.by }}</p>
                </div>
                <span class="pt-1" [appTooltip]="e.kind === 'email' ? '1 attachment' : 'Medical note'">
                  @if (e.kind === 'email') {
                    <span class="inline-flex items-center gap-0.5 text-xs font-medium text-ink-700">
                      <lucide-icon [img]="i.PaperclipIcon" class="h-4 w-4 text-brand-600" aria-hidden="true" />1<span class="sr-only"> attachment</span>
                    </span>
                  } @else {
                    <lucide-icon [img]="i.HeartPulseIcon" class="h-4 w-4 text-danger-600" aria-hidden="true" />
                    <span class="sr-only">Medical note</span>
                  }
                </span>
              </li>
            }
          </ol>
        } @else {
          <p class="py-6 text-center text-[13px] text-ink-500">No Records Found</p>
        }
      }
    </app-column-panel>
  `
})
export class ActivityWallPanel {
  readonly entries = input.required<WallEntry[]>();
  readonly addMessage = output<void>();
  readonly openEntry = output<WallEntry>();

  protected readonly searching = signal(false);
  protected readonly query = signal('');
  protected readonly monthOpen = signal(true);
  protected readonly visible = computed(() => {
    const q = this.query().trim().toLowerCase();
    return q ? this.entries().filter((e) => `${e.subject} ${e.by} ${e.label}`.toLowerCase().includes(q)) : this.entries();
  });

  protected readonly i = {
    ChevronDownIcon,
    FilterIcon,
    HeartPulseIcon,
    MailIcon,
    MessageSquareIcon,
    MessageSquarePlusIcon,
    PaperclipIcon,
    PlusIcon,
    RefreshCwIcon,
    SearchIcon,
    StickyNoteIcon
  };

  protected notAvailable(): void {
    toast('Filters aren’t part of this prototype.');
  }

  protected refreshed(): void {
    toast.success('Activity Wall is up to date');
  }
}
