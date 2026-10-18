import React from 'react';
import { ChevronsLeftIcon, ChevronsRightIcon, DownloadIcon, FileTextIcon, ForwardIcon, ReplyAllIcon, ReplyIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { Attachment, EmailMessage, InboxItem, ReplyMode } from '../../types/workspace';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { initialsOf } from '../../utils/email';

interface EmailViewerProps {
  inbox: InboxItem;
  email: EmailMessage;
  compact?: boolean;
  hasPrevious?: boolean;
  hasNext?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onReply: (mode: ReplyMode) => void;
  onTrash: () => void;
  onOpenAttachment: (attachment: Attachment) => void;
}

export function EmailViewer({ inbox, email, compact = false, hasPrevious, hasNext, onPrevious, onNext, onReply, onTrash, onOpenAttachment }: EmailViewerProps) {
  return (
    <article aria-label={`Email from ${inbox.fromName}`} className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-200 bg-ink-50 px-4 py-2">
        {!compact ?
        <Button size="sm" variant="ghost" leadingIcon={<ChevronsLeftIcon />} disabled={!hasPrevious} onClick={onPrevious}>
            Previous
          </Button> :

        <span />
        }
        <div role="group" aria-label="Email actions" className="flex flex-wrap items-center gap-1.5">
          {compact ?
          <>
              <IconButton label="Reply" variant="outline" size="sm" onClick={() => onReply('reply')}>
                <ReplyIcon />
              </IconButton>
              <IconButton label="Reply All" variant="outline" size="sm" onClick={() => onReply('all')}>
                <ReplyAllIcon />
              </IconButton>
              <IconButton label="Forward" variant="outline" size="sm" onClick={() => onReply('forward')}>
                <ForwardIcon />
              </IconButton>
              <IconButton label="Trash" variant="outline" size="sm" className="text-danger-600" onClick={onTrash}>
                <Trash2Icon />
              </IconButton>
            </> :

          <>
              <Button size="sm" leadingIcon={<ReplyIcon />} onClick={() => onReply('reply')}>
                Reply
              </Button>
              <Button size="sm" leadingIcon={<ReplyAllIcon />} onClick={() => onReply('all')}>
                Reply All
              </Button>
              <Button size="sm" leadingIcon={<ForwardIcon />} onClick={() => onReply('forward')}>
                Forward
              </Button>
              <Button size="sm" variant="danger" leadingIcon={<Trash2Icon />} onClick={onTrash}>
                Trash
              </Button>
            </>
          }
        </div>
        {!compact ?
        <Button size="sm" variant="ghost" trailingIcon={<ChevronsRightIcon />} disabled={!hasNext} onClick={onNext}>
            Next
          </Button> :
        inbox.replied ?
        <Badge tone="info" icon={<ReplyIcon aria-hidden="true" />}>
            Replied
          </Badge> :

        <span />
        }
      </div>

      <header className="flex gap-4 border-b border-ink-100 px-5 py-5">
        <Avatar initials={initialsOf(inbox.fromName)} tone="danger" size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs text-ink-500">{email.sentAt}</p>
            {inbox.replied && !compact &&
            <Badge tone="info" icon={<ReplyIcon aria-hidden="true" />}>
                Replied
              </Badge>
            }
          </div>
          <h2 className="mt-1 break-words text-base font-semibold text-ink-900">
            {inbox.fromName} <span className="font-normal text-ink-500">({inbox.fromEmail})</span>
          </h2>
          <p className="mt-0.5 text-sm font-semibold text-ink-900">{email.claimantLine}</p>
          <p className="mt-1 text-xs text-ink-500">
            <span className="font-medium text-ink-700">To</span> {email.to}
          </p>
          {email.attachments.length > 0 &&
          <ul aria-label="Attachments" className="mt-3 flex flex-wrap gap-2">
              {email.attachments.map((a) =>
            <li key={a.id} className="inline-flex items-center rounded-md border border-ink-200 bg-white shadow-xs">
                  <button
                type="button"
                onClick={() => onOpenAttachment(a)}
                className="focus-ring inline-flex items-center gap-1.5 rounded-l-md py-1 pl-2 pr-2.5 text-[13px] font-medium text-brand-700 transition-colors duration-150 hover:bg-brand-50">
                
                    <FileTextIcon className="h-4 w-4 text-danger-600" aria-hidden="true" />
                    {a.name}
                  </button>
                  <span className="h-5 w-px bg-ink-200" aria-hidden="true" />
                  <IconButton label={`Download ${a.name}`} size="sm" className="rounded-l-none" onClick={() => toast.success(`Downloading ${a.name}`)}>
                    <DownloadIcon />
                  </IconButton>
                </li>
            )}
            </ul>
          }
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 text-sm leading-6 text-ink-900">
        {email.body.map((lines, i) =>
        <p key={i}>
            {lines.map((line, j) =>
          <React.Fragment key={j}>
                {line}
                {j < lines.length - 1 && <br />}
              </React.Fragment>
          )}
          </p>
        )}
        <p className="text-ink-700">
          {email.signature.map((line, j) =>
          <React.Fragment key={j}>
              {j === 0 ? <span className="font-semibold text-ink-900">{line}</span> : line}
              {j < email.signature.length - 1 && <br />}
            </React.Fragment>
          )}
        </p>
      </div>
    </article>);

}