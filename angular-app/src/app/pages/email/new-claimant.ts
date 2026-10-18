import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CircleMinusIcon, MailIcon, MailXIcon, MenuIcon } from 'lucide-angular';
import { toast } from 'ngx-sonner';
import { NotFound } from '../../case/case-not-found';
import { underwriters } from '../../core/data/underwriters';
import { WorkspaceService } from '../../core/services/workspace.service';
import { BrokerRow, CaseStatus, Gender } from '../../core/types/workspace';
import { ageParts, formatUSDate, parseUSDate } from '../../core/utils/date';
import { getEmail } from '../../core/utils/email';
import { EmailViewer } from '../../email/email-viewer';
import { WindowBar } from '../../layout/window-bar';
import { Alert, Button, Choice, choiceInput, Control, Field, IconButton, SelectShell } from '../../shared/ui';

type AttachMedical = 'email' | 'attachments' | 'both' | 'none';
type ErrorKey = 'first' | 'last' | 'dob' | 'gender' | 'underwriter';

@Component({
  selector: 'app-new-claimant',
  imports: [FormsModule, NotFound, EmailViewer, WindowBar, Alert, Button, Choice, Control, Field, IconButton, SelectShell],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './new-claimant.html'
})
export class NewClaimant {
  readonly emailId = input<string>();
  private readonly ws = inject(WorkspaceService);
  private readonly router = inject(Router);

  protected readonly item = computed(() => this.ws.inbox().find((i) => i.id === this.emailId()));
  protected readonly email = computed(() => {
    const item = this.item();
    return item ? getEmail(item) : undefined;
  });

  // Form fields (template-driven, seeded from the email's prefill).
  protected prefix = '';
  protected first = '';
  protected middle = '';
  protected last = '';
  protected aka = '';
  protected readonly dob = signal('');
  protected gender: Gender | '' = '';
  protected flags = { rush: false, rework: false, mediation: false, msa: false, wc: false };
  protected status: CaseStatus = 'Ready for UW';
  protected underwriter = underwriters[0];
  protected attachMedical: AttachMedical = 'both';
  protected readonly brokers = signal<BrokerRow[]>([]);

  protected readonly errors = signal<Partial<Record<ErrorKey, string>>>({});
  protected readonly errorCount = computed(() => Object.values(this.errors()).filter(Boolean).length);
  protected readonly saving = signal<'close' | 'open' | null>(null);
  protected readonly age = computed(() => {
    const d = parseUSDate(this.dob());
    return d ? ageParts(d) : null;
  });

  protected readonly statuses: CaseStatus[] = ['Ready for UW', 'Rated*', 'CS Communicated'];
  protected readonly underwriters = underwriters;
  protected readonly flagList = [
    { key: 'rush', label: 'Rush' },
    { key: 'rework', label: 'Rework' },
    { key: 'mediation', label: 'Mediation' },
    { key: 'msa', label: 'MSA' },
    { key: 'wc', label: 'WC' }
  ] as const;
  protected readonly attachOptions: { value: AttachMedical; label: string }[] = [
    { value: 'email', label: 'Email' },
    { value: 'attachments', label: 'Attachment(s)' },
    { value: 'both', label: 'Both' },
    { value: 'none', label: 'Do Not Attach' }
  ];
  protected readonly choiceInput = choiceInput;
  protected readonly i = { CircleMinusIcon, MailIcon, MailXIcon, MenuIcon };

  constructor() {
    effect(() => {
      const mail = this.email();
      untracked(() => {
        const p = mail?.prefill;
        this.first = p?.first ?? '';
        this.middle = p?.middle ?? '';
        this.last = p?.last ?? '';
        this.dob.set(p?.dob ?? '');
        this.gender = p?.gender ?? '';
        this.brokers.set(mail?.broker ? [mail.broker] : []);
      });
    });
  }

  protected clear(key: ErrorKey): void {
    this.errors.update((e) => (key in e ? { ...e, [key]: undefined } : e));
  }

  protected removeBroker(id: string): void {
    this.brokers.update((b) => b.filter((x) => x.id !== id));
  }

  protected cancel(): void {
    this.router.navigate(['/email', this.emailId()]);
  }

  protected reply(mode: string): void {
    this.router.navigate(['/email', this.emailId(), 'reply'], { queryParams: { mode } });
  }

  protected openAttachment(id: string): void {
    this.router.navigate(['/document', id], { queryParams: { from: this.emailId() } });
  }

  protected submit(mode: 'close' | 'open'): void {
    const item = this.item();
    if (!item || this.saving()) return;
    const dobDate = parseUSDate(this.dob());
    const next: Partial<Record<ErrorKey, string>> = {};
    if (!this.first.trim()) next.first = 'Enter the claimant’s first name.';
    if (!this.last.trim()) next.last = 'Enter the claimant’s last name.';
    if (!this.dob().trim()) next.dob = 'Enter the date of birth.';
    else if (!dobDate) next.dob = 'Use the format MM/DD/YYYY.';
    if (!this.gender) next.gender = 'Select a gender.';
    if (!this.underwriter) next.underwriter = 'Assign an underwriter.';
    this.errors.set(next);
    const keys = Object.keys(next);
    if (keys.length) {
      document.getElementById(`claimant-${keys[0]}`)?.focus();
      return;
    }
    this.saving.set(mode);
    setTimeout(() => {
      const name = `${this.first.trim()} ${this.last.trim()}`.toUpperCase();
      const created = this.ws.addToQueue({
        rush: this.flags.rush,
        rework: this.flags.rework,
        claimant: name,
        dob: dobDate ? formatUSDate(dobDate) : this.dob(),
        gender: this.gender as Gender,
        dateReceived: item.receivedOn,
        sender: `${item.fromName} (${item.fromEmail})`,
        status: this.status
      });
      this.saving.set(null);
      const assignee = this.underwriter.replace(/\s*\(\d+\)$/, '');
      if (mode === 'close') {
        toast.success(`${name} added to the work queue`, { description: `Case ${created.caseNumber} · Assigned to ${assignee}` });
        this.router.navigate(['/'], { state: { highlight: created.id } });
      } else {
        toast.success(`Case ${created.caseNumber} created`, { description: `Assigned to ${assignee}` });
        this.router.navigate(['/case', created.caseNumber]);
      }
    }, 700);
  }
}
