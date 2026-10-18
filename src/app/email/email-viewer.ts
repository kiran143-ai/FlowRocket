import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ChevronsLeftIcon, ChevronsRightIcon, DownloadIcon, FileTextIcon, ForwardIcon, LucideAngularModule, ReplyAllIcon, ReplyIcon, Trash2Icon } from 'lucide-angular';
import { toast } from 'ngx-sonner';
import { Attachment, EmailMessage, InboxItem, ReplyMode } from '../core/types/workspace';
import { initialsOf } from '../core/utils/email';
import { Avatar, Badge, Button, IconButton } from '../shared/ui';

@Component({
  selector: 'app-email-viewer',
  imports: [LucideAngularModule, Avatar, Badge, Button, IconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './email-viewer.html',
  host: { class: 'flex h-full flex-col', role: 'article', '[attr.aria-label]': "'Email from ' + inbox().fromName" }
})
export class EmailViewer {
  readonly inbox = input.required<InboxItem>();
  readonly email = input.required<EmailMessage>();
  readonly compact = input(false, { transform: booleanAttribute });
  readonly hasPrevious = input(false, { transform: booleanAttribute });
  readonly hasNext = input(false, { transform: booleanAttribute });
  readonly previous = output<void>();
  readonly next = output<void>();
  readonly reply = output<ReplyMode>();
  readonly trash = output<void>();
  readonly openAttachment = output<Attachment>();

  protected readonly initialsOf = initialsOf;
  protected readonly i = { ChevronsLeftIcon, ChevronsRightIcon, DownloadIcon, FileTextIcon, ForwardIcon, ReplyAllIcon, ReplyIcon, Trash2Icon };

  protected download(a: Attachment): void {
    toast.success(`Downloading ${a.name}`);
  }
}
