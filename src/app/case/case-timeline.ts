import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FileTextIcon, FlagIcon, LucideAngularModule, LucideIconData, SendIcon, StickyNoteIcon } from 'lucide-angular';
import { TimelineEvent } from '../core/types/case';

const kinds: Record<TimelineEvent['kind'], { icon: LucideIconData; cls: string }> = {
  note: { icon: StickyNoteIcon, cls: 'text-brand-600' },
  document: { icon: FileTextIcon, cls: 'text-danger-600' },
  rated: { icon: FlagIcon, cls: 'text-warning-600' },
  requested: { icon: FlagIcon, cls: 'text-ink-500' },
  sent: { icon: SendIcon, cls: 'text-ink-500' }
};

@Component({
  selector: 'app-case-timeline',
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (events().length) {
      <ol class="relative space-y-5 before:absolute before:bottom-3 before:left-[15px] before:top-3 before:w-px before:bg-ink-200">
        @for (event of events(); track event.id) {
          <li class="relative flex gap-3">
            <span class="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink-200 bg-white">
              <lucide-icon [img]="kinds[event.kind].icon" [class]="'h-4 w-4 ' + kinds[event.kind].cls" aria-hidden="true" />
            </span>
            <div class="min-w-0 pt-0.5">
              <p class="text-[13px] font-semibold text-ink-900">{{ event.title }}</p>
              @if (event.link) {
                <button type="button" (click)="openLink.emit(event)" class="link break-words text-left text-[13px]">{{ event.link }}</button>
              }
              <p class="mt-0.5 text-xs text-ink-500">by {{ event.by }} on {{ event.on }}</p>
            </div>
          </li>
        }
      </ol>
    } @else {
      <p class="py-6 text-center text-[13px] text-ink-500">No Records Found</p>
    }
  `
})
export class CaseTimeline {
  readonly events = input.required<TimelineEvent[]>();
  readonly openLink = output<TimelineEvent>();
  protected readonly kinds = kinds;
}
