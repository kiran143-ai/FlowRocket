import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CirclePlusIcon, MailXIcon, MessageSquareIcon, PlusIcon, SendIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { mailboxes, postOnOptions } from '../data/underwriters';
import { RecipientFields } from '../components/email/RecipientFields';
import { RichTextEditor } from '../components/email/RichTextEditor';
import { EmptyState } from '../components/layout/EmptyState';
import { WindowBar } from '../components/layout/WindowBar';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { Select } from '../components/ui/Select';
import { TextInput } from '../components/ui/TextInput';
import { Recipients, ReplyMode } from '../types/workspace';
import { getEmail, quoteEmailHtml } from '../utils/email';

export function ReplyToBroker() {
  const { emailId } = useParams();
  const [params] = useSearchParams();
  const mode = (params.get('mode') ?? 'reply') as ReplyMode;
  const navigate = useNavigate();
  const { inbox, markReplied } = useWorkspace();
  const item = inbox.find((i) => i.id === emailId);
  const email = item ? getEmail(item) : undefined;

  const [postOn, setPostOn] = useState(postOnOptions[0]);
  const [recipients, setRecipients] = useState<Recipients>(() => ({
    from: mailboxes[0],
    to: mode === 'forward' || !item ? [] : [`${item.fromName} <${item.fromEmail}>`],
    cc: mode === 'forward' ? [] : ['SSMEDICALS NYL <ssmedicals@newyorklife.com>'],
    bcc: [],
    fax: []
  }));
  const [subject, setSubject] = useState(item ? `${mode === 'forward' ? 'FW' : 'RE'}: ${item.subject}` : '');
  const [errors, setErrors] = useState<{to?: string;subject?: string;}>({});
  const [sending, setSending] = useState(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (!item || !email) {
    return <EmptyState icon={<MailXIcon />} title="Email not found" action={<Link to="/" className="link text-sm">Back to Home Workspace</Link>} />;
  }

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!recipients.to.length && !recipients.fax.length) next.to = 'Add at least one email or fax recipient.';
    if (!subject.trim()) next.subject = 'Enter a subject.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    timer.current = window.setTimeout(() => {
      markReplied(item.id);
      setSending(false);
      toast.success('Message sent', { description: `To ${recipients.to[0] ?? recipients.fax[0]}${recipients.to.length > 1 ? ` +${recipients.to.length - 1}` : ''}` });
      navigate(`/email/${item.id}`);
    }, 800);
  };

  return (
    <div className="flex min-h-[calc(100vh-88px)] flex-col">
      <WindowBar title="My Wall" icon={<MessageSquareIcon />} />
      <div className="mx-auto w-full max-w-5xl flex-1 p-4 lg:p-6">
        <form noValidate onSubmit={send} className="rounded-lg border border-ink-200 bg-white shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 px-5 py-3">
            <h1 className="flex items-center gap-1.5 text-[15px] font-semibold text-ink-900">
              Add New
              <CirclePlusIcon className="h-4 w-4 text-brand-600" aria-hidden="true" />
            </h1>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" leadingIcon={<MessageSquareIcon />} onClick={() => navigate('/case/26-01867')}>
                Post(s)
              </Button>
              <Button size="sm" variant="ghost" leadingIcon={<PlusIcon />} onClick={() => toast('You’re already adding a new post.')}>
                Add New Post
              </Button>
            </div>
          </div>

          <div className="space-y-5 px-5 py-5">
            <div className="flex items-center gap-3">
              <label htmlFor="post-on" className="text-[13px] font-medium text-ink-700">
                Post On
              </label>
              <Select id="post-on" wrapperClassName="w-48" value={postOn} onChange={(e) => setPostOn(e.target.value)}>
                {postOnOptions.map((o) =>
                <option key={o}>{o}</option>
                )}
              </Select>
            </div>

            <RecipientFields idPrefix="wall" value={recipients} onChange={setRecipients} fromOptions={mailboxes} toError={errors.to} />

            <Field label="Subject" htmlFor="wall-subject" error={errors.subject}>
              <TextInput id="wall-subject" className="max-w-2xl" value={subject} invalid={!!errors.subject} aria-describedby={errors.subject ? 'wall-subject-error' : undefined} onChange={(e) => setSubject(e.target.value)} />
            </Field>

            <RichTextEditor id="wall-message" label="Message" initialHtml={quoteEmailHtml(item, email)} minHeight={240} />
          </div>

          <div className="flex justify-end gap-2 border-t border-ink-100 bg-ink-50 px-5 py-3">
            <Button variant="danger" disabled={sending} onClick={() => navigate(`/email/${item.id}`)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" leadingIcon={<SendIcon />} loading={sending}>
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>);

}