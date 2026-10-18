import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MailIcon, MailXIcon, Trash2Icon } from 'lucide-angular';
import { toast } from 'ngx-sonner';
import { NotFound } from '../../case/case-not-found';
import { WorkspaceService } from '../../core/services/workspace.service';
import { getEmail } from '../../core/utils/email';
import { ClaimantSearch } from '../../email/claimant-search';
import { EmailViewer } from '../../email/email-viewer';
import { WindowBar } from '../../layout/window-bar';
import { Button, Modal } from '../../shared/ui';

@Component({
  selector: 'app-email-review',
  imports: [NotFound, ClaimantSearch, EmailViewer, WindowBar, Button, Modal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (item(); as item) {
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
  private readonly router = inject(Router);
  protected readonly index = computed(() => this.ws.inbox().findIndex((i) => i.id === this.emailId()));
  protected readonly item = computed(() => this.ws.inbox()[this.index()]);
  protected readonly email = computed(() => {
    const item = this.item();
    return item ? getEmail(item) : undefined;
  });
  protected readonly confirmTrash = signal(false);
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
