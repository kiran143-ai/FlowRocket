import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, MailIcon, MailXIcon, PaperclipIcon, ReplyIcon, Trash2Icon } from 'lucide-angular';
import { toast } from 'ngx-sonner';
import { NotFound } from '../../case/case-not-found';
import { ThemeService } from '../../core/services/theme.service';
import { InboxItem } from '../../core/types/workspace';
import { WorkspaceService } from '../../core/services/workspace.service';
import { getEmail } from '../../core/utils/email';
import { ClaimantSearch } from '../../email/claimant-search';
import { EmailViewer } from '../../email/email-viewer';
import { WindowBar } from '../../layout/window-bar';
import { Badge, Button, Modal } from '../../shared/ui';

@Component({
  selector: 'app-email-review',
  imports: [NotFound, ClaimantSearch, EmailViewer, WindowBar, Badge, Button, Modal, LucideAngularModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (item(); as item) {
      @if (theme.isEvergreen()) {
      <div class="grid min-h-[calc(100vh-56px)] bg-white grid-cols-[minmax(0,1fr)] lg:h-[calc(100vh-56px)] lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <h1 class="sr-only">Email & Document Review — {{ item.subject }}</h1>

        <section aria-labelledby="inbox-list-title" class="flex min-h-0 flex-col border-b border-ink-200 lg:row-span-2 lg:border-b-0 lg:border-r xl:row-span-1">
          <div class="space-y-3 border-b border-ink-100 px-4 pb-3 pt-4">
            <h2 id="inbox-list-title" class="text-[15px] font-semibold text-ink-900">SS Medicals Inbox</h2>
            <div role="group" aria-label="Filter inbox" class="grid grid-cols-3 gap-0.5 rounded-lg bg-ink-100 p-0.5">
              @for (f of listFilters; track f.id) {
                <button
                  type="button"
                  [attr.aria-pressed]="listFilter() === f.id"
                  (click)="listFilter.set(f.id)"
                  class="focus-ring h-7 rounded-md text-xs font-semibold transition-colors duration-150"
                  [class]="listFilter() === f.id ? 'bg-white text-ink-900 shadow-xs' : 'text-ink-700 hover:text-ink-900'">
                  {{ f.label }}
                </button>
              }
            </div>
          </div>
          <ul class="min-h-0 flex-1 divide-y divide-ink-100 overflow-y-auto" aria-label="Inbox messages">
            @for (m of listed(); track m.id) {
              <li>
                <a
                  [routerLink]="['/email', m.id]"
                  [attr.aria-current]="m.id === item.id ? 'page' : null"
                  class="focus-ring block border-l-[3px] px-4 py-3 transition-colors duration-150 focus-visible:ring-inset"
                  [class]="m.id === item.id ? 'border-brand-600 bg-brand-50' : 'border-transparent hover:bg-ink-50'">
                  <span class="flex items-baseline justify-between gap-2">
                    <span class="truncate text-sm text-ink-900" [class.font-semibold]="!m.replied">{{ m.fromName }}</span>
                    <span class="shrink-0 text-xs tabular-nums text-ink-500">{{ m.receivedOn }}</span>
                  </span>
                  <span class="mt-0.5 block truncate text-[13px] text-ink-700">{{ m.subject }}</span>
                  <span class="mt-1.5 flex items-center justify-between gap-2">
                    <span class="inline-flex items-center gap-1 text-xs text-ink-500">
                      <lucide-icon [img]="PaperclipIcon" class="h-3.5 w-3.5" aria-hidden="true" />
                      {{ attachmentCount(m) }}<span class="sr-only"> attachments</span>
                    </span>
                    @if (m.replied) {
                      <app-badge tone="info" [icon]="ReplyIcon">Replied</app-badge>
                    } @else {
                      <app-badge tone="warning" dot>Not replied</app-badge>
                    }
                  </span>
                </a>
              </li>
            } @empty {
              <li class="px-4 py-10 text-center text-[13px] text-ink-500">No messages in this view.</li>
            }
          </ul>
        </section>

        <div class="min-h-0 min-w-0 lg:overflow-y-auto">
          <app-email-viewer
            [inbox]="item"
            [email]="email()!"
            [hasPrevious]="index() > 0"
            [hasNext]="index() < ws.inbox().length - 1"
            (previous)="nav(['/email', ws.inbox()[index() - 1].id])"
            (next)="nav(['/email', ws.inbox()[index() + 1].id])"
            (reply)="nav(['/email', item.id, 'reply'], { mode: $event })"
            (trash)="confirmTrash.set(true)"
            (openAttachment)="nav(['/document', $event.id], { from: item.id })" />
        </div>

        <aside aria-label="Claimant search" class="min-h-0 border-t border-ink-200 lg:col-start-2 lg:overflow-y-auto xl:col-start-auto xl:border-l xl:border-t-0">
          <app-claimant-search (newClaimant)="nav(['/email', item.id, 'new-claimant'])" (openClaimant)="nav(['/case', $event.caseNumber])" />
        </aside>
      </div>
      } @else {
        <div class="flex min-h-[calc(100vh-88px)] flex-col">
          <app-window-bar [heading]="item.subject" [icon]="MailIcon" />
          <h1 class="sr-only">Email & Document Review — {{ item.subject }}</h1>
          <div class="grid flex-1 bg-white lg:grid-cols-[minmax(340px,400px)_minmax(0,1fr)]">
            <aside aria-label="Claimant search" class="border-b border-ink-200 lg:border-b-0 lg:border-r">
              <app-claimant-search (newClaimant)="nav(['/email', item.id, 'new-claimant'])" (openClaimant)="nav(['/case', $event.caseNumber])" />
            </aside>
            <div class="min-w-0">
              <app-email-viewer
                [inbox]="item"
                [email]="email()!"
                [hasPrevious]="index() > 0"
                [hasNext]="index() < ws.inbox().length - 1"
                (previous)="nav(['/email', ws.inbox()[index() - 1].id])"
                (next)="nav(['/email', ws.inbox()[index() + 1].id])"
                (reply)="nav(['/email', item.id, 'reply'], { mode: $event })"
                (trash)="confirmTrash.set(true)"
                (openAttachment)="nav(['/document', $event.id], { from: item.id })" />
            </div>
          </div>
        </div>
      }
      <app-modal [open]="confirmTrash()" heading="Move this email to trash?" [description]="'“' + item.subject + '” from ' + item.fromName + ' will be removed from the SS Medicals Inbox.'" (closed)="confirmTrash.set(false)">
        <div modalFooter class="contents">
          <button appButton (click)="confirmTrash.set(false)">Cancel</button>
          <button appButton variant="destructive" [leadingIcon]="Trash2Icon" (click)="trash()">Move to Trash</button>
        </div>
      </app-modal>
    } @else {
      <app-not-found heading="This email is no longer in the inbox" description="It may have been moved to trash." [icon]="MailXIcon" />
    }
  `
})
export class EmailReview {
  readonly emailId = input<string>();
  protected readonly ws = inject(WorkspaceService);
  protected readonly theme = inject(ThemeService);
  private readonly router = inject(Router);
  protected readonly index = computed(() => this.ws.inbox().findIndex((i) => i.id === this.emailId()));
  protected readonly item = computed(() => this.ws.inbox()[this.index()]);
  protected readonly email = computed(() => {
    const item = this.item();
    return item ? getEmail(item) : undefined;
  });
  protected readonly confirmTrash = signal(false);

  /** SSTL layout: the inbox list beside the reader. */
  protected readonly listFilter = signal<'all' | 'open' | 'replied'>('all');
  protected readonly listFilters = [
    { id: 'all', label: 'All' },
    { id: 'open', label: 'Not replied' },
    { id: 'replied', label: 'Replied' }
  ] as const;
  protected readonly listed = computed(() => {
    const f = this.listFilter();
    const all = this.ws.inbox();
    return f === 'all' ? all : all.filter((m) => (f === 'replied' ? m.replied : !m.replied));
  });
  protected attachmentCount(m: InboxItem): number {
    return getEmail(m).attachments.length;
  }
  protected readonly PaperclipIcon = PaperclipIcon;
  protected readonly ReplyIcon = ReplyIcon;
  protected readonly MailIcon = MailIcon;
  protected readonly MailXIcon = MailXIcon;
  protected readonly Trash2Icon = Trash2Icon;

  protected nav(commands: string[], queryParams?: Record<string, string>): void {
    this.router.navigate(commands, { queryParams });
  }

  protected trash(): void {
    const item = this.item();
    const index = this.index();
    this.ws.trashInbox(item.id);
    this.confirmTrash.set(false);
    toast('Email moved to trash', { description: item.subject, action: { label: 'Undo', onClick: () => this.ws.restoreInbox(item, index) } });
    this.router.navigate(['/']);
  }
}
