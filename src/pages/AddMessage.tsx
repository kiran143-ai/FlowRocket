import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Building2Icon, DownloadIcon, EyeIcon, FileTextIcon, FileXIcon, MessageSquareIcon, PaperclipIcon, PlusIcon, SendIcon, UserRoundIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { brokerContacts, brokerFirms } from '../data/brokers';
import { mailboxes, messageCategories } from '../data/underwriters';
import { useCase } from '../hooks/useCase';
import { CaseLayout } from '../components/case/CaseLayout';
import { Column, DataTable } from '../components/DataTable';
import { RecipientFields } from '../components/email/RecipientFields';
import { RichTextEditor } from '../components/email/RichTextEditor';
import { EmptyState } from '../components/layout/EmptyState';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { Field } from '../components/ui/Field';
import { Select } from '../components/ui/Select';
import { Tabs } from '../components/ui/Tabs';
import { TextInput } from '../components/ui/TextInput';
import { IconButton } from '../components/ui/IconButton';
import { Recipients } from '../types/workspace';
import { CaseRecord } from '../types/case';
import { raFileName, raSubject } from '../utils/raSheet';
import { downloadRASheet } from '../utils/raSheetPdf';

const firstName = (full: string) => {
  const first = full.split(' ')[0];
  return first.charAt(0) + first.slice(1).toLowerCase();
};

const raBody = (c: CaseRecord) =>
  c.rating ?
  `<p>Hi ${firstName(c.broker.contact)},</p><p>Please find attached the Rated Age Confirmation for <b>${c.claimantName}</b> (Case # ${c.caseNumber}).</p><ul><li>Final rated age: <b>${c.rating.finalRatedAge}</b></li><li>Normal life expectancy: ${c.rating.normalLE.toFixed(2)} years</li><li>Valid through: ${c.rating.expirationDate}</li></ul><p>Let me know if you have any questions.</p><p>Thank you,<br/>${c.underwriter.name}<br/>Structured Settlements Medical Underwriting</p>` :
  '';

type Contact = (typeof brokerContacts)[number];
type Firm = (typeof brokerFirms)[number];

export function AddMessage() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const c = useCase(caseId);
  const { setCaseStatus } = useWorkspace();
  const [recipients, setRecipients] = useState<Recipients>({ from: mailboxes[1], to: [c?.broker.email ?? ''].filter(Boolean), cc: [], bcc: [], fax: [] });
  const [subject, setSubject] = useState(c ? raSubject(c) : '');
  const [attached, setAttached] = useState(!!c?.rating);
  const [category, setCategory] = useState(messageCategories[0]);
  const [tab, setTab] = useState('contacts');
  const [errors, setErrors] = useState<{to?: string;subject?: string;}>({});
  const [sending, setSending] = useState(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (!c) return <EmptyState icon={<FileXIcon />} title="Case not found" action={<Link to="/" className="link text-sm">Back to Home Workspace</Link>} />;

  const toggleEmail = (email: string, on: boolean) =>
  setRecipients((r) => ({ ...r, to: on ? r.to.includes(email) ? r.to : [...r.to, email] : r.to.filter((x) => x !== email) }));

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!recipients.to.length && !recipients.fax.length) next.to = 'Add at least one recipient, or select a broker contact.';
    if (!subject.trim()) next.subject = 'Enter a subject.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    timer.current = window.setTimeout(() => {
      setSending(false);
      if (category === 'RA Communication') setCaseStatus(c.caseNumber, 'CS Communicated');
      toast.success(category === 'RA Communication' ? 'RA confirmation sent to broker' : 'Message sent', { description: `${subject} · ${recipients.to.join(', ')}` });
      navigate(`/case/${c.caseNumber}`);
    }, 800);
  };

  const contactColumns: Column<Contact>[] = [
  {
    key: 'name',
    header: 'Broker name',
    sortValue: (r) => r.name,
    render: (r) =>
    <span className="font-medium text-brand-700">
          {r.name} <span className="font-normal text-ink-500">({r.firm})</span>
        </span>

  },
  {
    key: 'email',
    header: 'Email',
    render: (r) => <Checkbox label={r.email} checked={recipients.to.includes(r.email)} onChange={(e) => toggleEmail(r.email, e.target.checked)} className="text-[13px]" />
  },
  { key: 'fax', header: 'Fax', render: (r) => r.fax || <span className="text-ink-400">—</span> }];


  const firmColumns: Column<Firm>[] = [
  {
    key: 'firm',
    header: 'Broker Firm',
    sortValue: (r) => r.firm,
    render: (r) => {
      const emails = brokerContacts.filter((b) => b.firm === r.firm).map((b) => b.email);
      const all = emails.every((m) => recipients.to.includes(m));
      return <Checkbox label={r.firm} checked={all} onChange={(e) => emails.forEach((m) => toggleEmail(m, e.target.checked))} className="text-[13px] font-medium" />;
    }
  },
  { key: 'city', header: 'City', sortValue: (r) => r.city, render: (r) => r.city }];


  return (
    <CaseLayout
      caseRecord={c}
      title={c.rating ? 'Email RA confirmation to broker' : 'Add Message'}
      headerExtra={
      <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" leadingIcon={<MessageSquareIcon />} onClick={() => navigate(`/case/${c.caseNumber}`)}>
            Wall
          </Button>
          <Button size="sm" variant="ghost" leadingIcon={<PlusIcon />} onClick={() => toast('You’re already adding a new message.')}>
            Add New Message
          </Button>
        </div>
      }>
      
      <form noValidate onSubmit={send} className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-5 rounded-lg border border-ink-200 bg-white p-5 shadow-xs">
          <RecipientFields idPrefix="msg" value={recipients} onChange={setRecipients} fromOptions={mailboxes} toError={errors.to} />
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
            <Field label="Subject" htmlFor="msg-subject" error={errors.subject}>
              <TextInput id="msg-subject" value={subject} invalid={!!errors.subject} aria-describedby={errors.subject ? 'msg-subject-error' : undefined} onChange={(e) => setSubject(e.target.value)} />
            </Field>
            <Field label="Category" htmlFor="msg-category">
              <Select id="msg-category" value={category} onChange={(e) => setCategory(e.target.value)}>
                {messageCategories.map((m) =>
                <option key={m}>{m}</option>
                )}
              </Select>
            </Field>
          </div>
          <div>
            <p className="mb-1.5 text-[13px] font-medium text-ink-700">Attachments</p>
            {attached ?
            <div className="flex items-center gap-3 rounded-md border border-ink-200 bg-ink-50 px-3 py-2">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded bg-danger-50 text-danger-600" aria-hidden="true">
                  <FileTextIcon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-ink-900">{raFileName(c)}</p>
                  <p className="text-xs text-ink-500">RA Confirmation Sheet · PDF · Rated age {c.rating?.finalRatedAge}</p>
                </div>
                <IconButton label="Preview attachment" size="sm" onClick={() => navigate(`/case/${c.caseNumber}/ra-sheet`)}>
                  <EyeIcon />
                </IconButton>
                <IconButton label="Download attachment" size="sm" onClick={() => downloadRASheet(c)}>
                  <DownloadIcon />
                </IconButton>
                <IconButton label="Remove attachment" size="sm" variant="danger" onClick={() => setAttached(false)}>
                  <XIcon />
                </IconButton>
              </div> :

            <Button size="sm" leadingIcon={<PaperclipIcon />} disabled={!c.rating} onClick={() => setAttached(true)}>
                {c.rating ? 'Attach RA confirmation sheet' : 'RA sheet available after rating'}
              </Button>
            }
          </div>
          <RichTextEditor id="msg-body" label="Message" minHeight={220} initialHtml={raBody(c)} />
          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <Button variant="danger" disabled={sending} onClick={() => navigate(`/case/${c.caseNumber}/rating`)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" leadingIcon={<SendIcon />} loading={sending}>
              Send
            </Button>
          </div>
        </div>

        <section aria-labelledby="broker-recipients" className="rounded-lg border border-ink-200 bg-white shadow-xs">
          <h2 id="broker-recipients" className="border-b border-ink-100 px-4 py-3 text-[15px] font-semibold text-ink-900">
            Select Brokers Recipients
          </h2>
          <Tabs
            idPrefix="brokers"
            label="Broker recipients"
            value={tab}
            onChange={setTab}
            className="px-3 pt-1"
            items={[
            { id: 'firms', label: 'Broker Firm(s)', icon: <Building2Icon /> },
            { id: 'contacts', label: 'Broker Contact(s)', icon: <UserRoundIcon /> }]
            } />
          
          <div id={`brokers-panel-${tab}`} role="tabpanel" aria-labelledby={`brokers-tab-${tab}`}>
            {tab === 'contacts' ?
            <DataTable id="broker-contacts" label="Broker Contact(s)" columns={contactColumns} rows={brokerContacts} defaultPageSize={5} getRowId={(r) => r.id} getSearchText={(r) => `${r.name} ${r.firm} ${r.email}`} /> :

            <DataTable id="broker-firms" label="Broker Firm(s)" columns={firmColumns} rows={brokerFirms} defaultPageSize={5} getRowId={(r) => r.id} getSearchText={(r) => `${r.firm} ${r.city}`} />
            }
          </div>
        </section>
      </form>
    </CaseLayout>);

}