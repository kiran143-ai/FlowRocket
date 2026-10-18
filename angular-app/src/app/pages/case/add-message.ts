import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Building2Icon, DownloadIcon, EyeIcon, FileTextIcon, LucideAngularModule, MessageSquareIcon, PaperclipIcon, PlusIcon, SendIcon, UserRoundIcon, XIcon } from 'lucide-angular';
import { toast } from 'ngx-sonner';
import { CaseLayout } from '../../case/case-layout';
import { NotFound } from '../../case/case-not-found';
import { brokerContacts, brokerFirms } from '../../core/data/brokers';
import { mailboxes, messageCategories } from '../../core/data/underwriters';
import { CaseService } from '../../core/services/case.service';
import { RaSheetService } from '../../core/services/ra-sheet.service';
import { WorkspaceService } from '../../core/services/workspace.service';
import { CaseRecord } from '../../core/types/case';
import { Recipients } from '../../core/types/workspace';
import { raFileName, raSubject } from '../../core/utils/raSheet';
import { RecipientFields } from '../../email/recipient-fields';
import { RichTextEditor } from '../../email/rich-text-editor';
import { Cell, Column, DataTable } from '../../shared/data-table';
import { Button, Choice, choiceInput, Control, Field, IconButton, SelectShell, Tabs } from '../../shared/ui';

type Contact = (typeof brokerContacts)[number];
type Firm = (typeof brokerFirms)[number];

const firstName = (full: string) => {
  const first = full.split(' ')[0];
  return first.charAt(0) + first.slice(1).toLowerCase();
};

const raBody = (c: CaseRecord) =>
  c.rating
    ? `<p>Hi ${firstName(c.broker.contact)},</p><p>Please find attached the Rated Age Confirmation for <b>${c.claimantName}</b> (Case # ${c.caseNumber}).</p><ul><li>Final rated age: <b>${c.rating.finalRatedAge}</b></li><li>Normal life expectancy: ${c.rating.normalLE.toFixed(2)} years</li><li>Valid through: ${c.rating.expirationDate}</li></ul><p>Let me know if you have any questions.</p><p>Thank you,<br/>${c.underwriter.name}<br/>Structured Settlements Medical Underwriting</p>`
    : '';

@Component({
  selector: 'app-add-message',
  imports: [FormsModule, LucideAngularModule, CaseLayout, NotFound, RecipientFields, RichTextEditor, DataTable, Cell, Button, Choice, Control, Field, IconButton, SelectShell, Tabs],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-message.html'
})
export class AddMessage {
  readonly caseId = input<string>();
  protected readonly caseRecord = inject(CaseService).byId(this.caseId);
  protected readonly raSheet = inject(RaSheetService);
  private readonly ws = inject(WorkspaceService);
  private readonly router = inject(Router);

  // Re-seeded whenever the route switches to another case.
  protected readonly recipients = linkedSignal<Recipients>(() => ({
    from: mailboxes[1],
    to: [this.caseRecord()?.broker.email ?? ''].filter(Boolean),
    cc: [],
    bcc: [],
    fax: []
  }));
  protected readonly subject = linkedSignal(() => {
    const c = this.caseRecord();
    return c ? raSubject(c) : '';
  });
  protected readonly attached = linkedSignal(() => !!this.caseRecord()?.rating);
  protected readonly body = computed(() => {
    const c = this.caseRecord();
    return c ? raBody(c) : '';
  });
  protected readonly fileName = computed(() => {
    const c = this.caseRecord();
    return c ? raFileName(c) : '';
  });
  protected category = messageCategories[0];
  protected readonly tab = signal('contacts');
  protected readonly errors = signal<{ to?: string; subject?: string }>({});
  protected readonly sending = signal(false);

  protected readonly mailboxes = mailboxes;
  protected readonly messageCategories = messageCategories;
  protected readonly brokerContacts = brokerContacts;
  protected readonly brokerFirms = brokerFirms;
  protected readonly choiceInput = choiceInput;
  protected readonly tabs = [
    { id: 'firms', label: 'Broker Firm(s)', icon: Building2Icon },
    { id: 'contacts', label: 'Broker Contact(s)', icon: UserRoundIcon }
  ];
  protected readonly contactColumns: Column<Contact>[] = [
    { key: 'name', header: 'Broker name', sortValue: (r) => r.name },
    { key: 'email', header: 'Email' },
    { key: 'fax', header: 'Fax' }
  ];
  protected readonly firmColumns: Column<Firm>[] = [
    { key: 'firm', header: 'Broker Firm', sortValue: (r) => r.firm },
    { key: 'city', header: 'City', sortValue: (r) => r.city, value: (r) => r.city }
  ];
  protected readonly contactId = (r: Contact) => r.id;
  protected readonly contactText = (r: Contact) => `${r.name} ${r.firm} ${r.email}`;
  protected readonly firmId = (r: Firm) => r.id;
  protected readonly firmText = (r: Firm) => `${r.firm} ${r.city}`;
  protected readonly i = { DownloadIcon, EyeIcon, FileTextIcon, MessageSquareIcon, PaperclipIcon, PlusIcon, SendIcon, XIcon };

  protected toggleEmail(email: string, on: boolean): void {
    this.recipients.update((r) => ({ ...r, to: on ? (r.to.includes(email) ? r.to : [...r.to, email]) : r.to.filter((x) => x !== email) }));
  }

  protected firmEmails(firm: string): string[] {
    return brokerContacts.filter((b) => b.firm === firm).map((b) => b.email);
  }

  protected allSelected(firm: string): boolean {
    return this.firmEmails(firm).every((m) => this.recipients().to.includes(m));
  }

  protected toggleFirm(firm: string, on: boolean): void {
    this.firmEmails(firm).forEach((m) => this.toggleEmail(m, on));
  }

  protected go(path: string): void {
    this.router.navigateByUrl(`/case/${this.caseId()}${path}`);
  }

  protected alreadyAdding(): void {
    toast('You’re already adding a new message.');
  }

  protected send(c: CaseRecord): void {
    const r = this.recipients();
    const next: { to?: string; subject?: string } = {};
    if (!r.to.length && !r.fax.length) next.to = 'Add at least one recipient, or select a broker contact.';
    if (!this.subject().trim()) next.subject = 'Enter a subject.';
    this.errors.set(next);
    if (Object.keys(next).length) return;
    this.sending.set(true);
    setTimeout(() => {
      this.sending.set(false);
      const isRA = this.category === 'RA Communication';
      if (isRA) this.ws.setCaseStatus(c.caseNumber, 'CS Communicated');
      toast.success(isRA ? 'RA confirmation sent to broker' : 'Message sent', { description: `${this.subject()} · ${r.to.join(', ')}` });
      this.go('');
    }, 800);
  }
}
