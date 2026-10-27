import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CirclePlusIcon, DownloadIcon, EyeIcon, FileTextIcon, LucideAngularModule, MailXIcon, MessageSquareIcon, PaperclipIcon, PlusIcon, SendIcon, XIcon } from 'lucide-angular';
import { toast } from 'ngx-sonner';
import { NotFound } from '../../case/case-not-found';
import { mailboxes, postOnOptions } from '../../core/data/underwriters';
import { WorkspaceService } from '../../core/services/workspace.service';
import { Attachment, Recipients, ReplyMode } from '../../core/types/workspace';
import { getEmail, quoteEmailHtml } from '../../core/utils/email';
import { RecipientFields } from '../../email/recipient-fields';
import { RichTextEditor } from '../../email/rich-text-editor';
import { WindowBar } from '../../layout/window-bar';
import { Button, Control, Field, IconButton, SelectShell } from '../../shared/ui';

@Component({
  selector: 'app-reply-to-broker',
  imports: [FormsModule, LucideAngularModule, NotFound, RecipientFields, RichTextEditor, WindowBar, Button, Control, Field, IconButton, SelectShell],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reply-to-broker.html'
})
export class ReplyToBroker {
  readonly emailId = input<string>();
  /** ?mode=reply|all|forward */
  readonly mode = input<ReplyMode | undefined>();
  private readonly ws = inject(WorkspaceService);
  private readonly router = inject(Router);

  protected readonly item = computed(() => this.ws.inbox().find((i) => i.id === this.emailId()));
  protected readonly quoted = computed(() => {
    const item = this.item();
    return item ? quoteEmailHtml(item, getEmail(item)) : '';
  });
  private readonly replyMode = computed(() => this.mode() ?? 'reply');

  protected postOn = postOnOptions[0];
  protected readonly recipients = linkedSignal<Recipients>(() => {
    const item = this.item();
    const fwd = this.replyMode() === 'forward';
    return {
      from: mailboxes[0],
      to: fwd || !item ? [] : [`${item.fromName} <${item.fromEmail}>`],
      cc: fwd ? [] : ['SSMEDICALS NYL <ssmedicals@newyorklife.com>'],
      bcc: [],
      fax: []
    };
  });
  protected readonly subject = linkedSignal(() => {
    const item = this.item();
    return item ? `${this.replyMode() === 'forward' ? 'FW' : 'RE'}: ${item.subject}` : '';
  });
  /** The original email's attachments travel with the reply; the user can drop any of them. */
  protected readonly attachments = linkedSignal<Attachment[]>(() => {
    const item = this.item();
    return item ? getEmail(item).attachments : [];
  });
  protected readonly errors = signal<{ to?: string; subject?: string }>({});
  protected readonly sending = signal(false);

  protected readonly mailboxes = mailboxes;
  protected readonly postOnOptions = postOnOptions;
  protected readonly i = { CirclePlusIcon, DownloadIcon, EyeIcon, FileTextIcon, MailXIcon, MessageSquareIcon, PaperclipIcon, PlusIcon, SendIcon, XIcon };

  protected preview(a: Attachment): void {
    this.router.navigate(['/document', a.id], { queryParams: { from: this.emailId() } });
  }

  protected download(a: Attachment): void {
    toast.success(`Downloading ${a.name}`);
  }

  protected remove(id: string): void {
    this.attachments.update((list) => list.filter((a) => a.id !== id));
  }

  protected back(): void {
    this.router.navigate(['/email', this.emailId()]);
  }

  protected openWall(): void {
    this.router.navigate(['/case', '26-01867']);
  }

  protected alreadyAdding(): void {
    toast('You’re already adding a new post.');
  }

  protected send(): void {
    const r = this.recipients();
    const next: { to?: string; subject?: string } = {};
    if (!r.to.length && !r.fax.length) next.to = 'Add at least one email or fax recipient.';
    if (!this.subject().trim()) next.subject = 'Enter a subject.';
    this.errors.set(next);
    if (Object.keys(next).length) return;
    this.sending.set(true);
    setTimeout(() => {
      this.ws.markReplied(this.emailId()!);
      this.sending.set(false);
      toast.success('Message sent', { description: `To ${r.to[0] ?? r.fax[0]}${r.to.length > 1 ? ` +${r.to.length - 1}` : ''}` });
      this.back();
    }, 800);
  }
}
