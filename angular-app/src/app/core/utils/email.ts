import { emails } from '../data/emails';
import { Attachment, EmailMessage, InboxItem } from '../types/workspace';

export function getEmail(item: InboxItem): EmailMessage {
  const found = emails.find((e) => e.inboxId === item.id);
  if (found) return found;
  return {
    inboxId: item.id,
    sentAt: item.receivedOn,
    claimantLine: item.subject,
    to: 'SS Medicals <ssmedicals@newyorklife.com>',
    attachments: [],
    body: [['Hello,'], [`Please see the request regarding: ${item.subject}.`], ['Thank you,']],
    signature: [item.fromName]
  };
}

export function getAttachment(id: string | undefined): {attachment: Attachment;email: EmailMessage;} | null {
  for (const email of emails) {
    const attachment = email.attachments.find((a) => a.id === id);
    if (attachment) return { attachment, email };
  }
  return null;
}

export function initialsOf(name: string): string {
  return name.
  split(/[\s,]+/).
  filter(Boolean).
  slice(0, 2).
  map((p) => p[0]?.toUpperCase() ?? '').
  join('');
}

export function quoteEmailHtml(item: InboxItem, email: EmailMessage): string {
  const paragraphs = email.body.map((lines) => `<p>${lines.join('<br>')}</p>`).join('');
  return `<p><br></p><hr><p><strong>From:</strong> ${item.fromName} (${item.fromEmail})<br><strong>Sent:</strong> ${email.sentAt}<br><strong>Subject:</strong> ${item.subject}</p>${paragraphs}<p>${email.signature.join('<br>')}</p>`;
}