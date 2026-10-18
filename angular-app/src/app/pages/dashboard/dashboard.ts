import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  ChartLineIcon,
  ClipboardCheckIcon,
  FlagIcon,
  InboxIcon,
  LucideAngularModule,
  LucideIconData,
  MailIcon,
  ReplyIcon,
  SendIcon,
  StethoscopeIcon,
  Trash2Icon,
  XIcon
} from 'lucide-angular';
import { toast } from 'ngx-sonner';
import { returnEmailReceipts } from '../../core/data/returnEmailReceipts';
import { secondaryReviewItems } from '../../core/data/secondaryReview';
import { CaseService } from '../../core/services/case.service';
import { WorkspaceService } from '../../core/services/workspace.service';
import { CaseStatus, InboxItem, QueueItem, ReturnEmailItem, SecondaryReviewItem } from '../../core/types/workspace';
import { cn } from '../../core/utils/cn';
import { Cell, Column, DataTable } from '../../shared/data-table';
import { Button, FlagIndicator, IconButton, Modal, Panel, StatCard, StatTone, StatusBadge, Tooltip } from '../../shared/ui';

type QueueFilter = 'all' | CaseStatus | 'flagged';

interface PipelineCard {
  eyebrow: string;
  label: string;
  value: number;
  icon: LucideIconData;
  tone: StatTone;
  hint: string;
  action: string;
  active?: boolean;
  badge?: string;
  run: () => void;
}

const dateSort = (v: string): number => {
  const m = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}) (AM|PM)/.exec(v);
  if (!m) return 0;
  const hours = (Number(m[4]) % 12) + (m[6] === 'PM' ? 12 : 0);
  return new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]), hours, Number(m[5])).getTime();
};

@Component({
  selector: 'app-dashboard',
  imports: [NgTemplateOutlet, RouterLink, LucideAngularModule, DataTable, Cell, Button, FlagIndicator, IconButton, Modal, Panel, StatCard, StatusBadge, Tooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html'
})
export class Dashboard {
  protected readonly ws = inject(WorkspaceService);
  private readonly cases = inject(CaseService);
  private readonly router = inject(Router);
  private readonly queueEl = viewChild<ElementRef<HTMLElement>>('queueEl');
  private readonly inboxEl = viewChild<ElementRef<HTMLElement>>('inboxEl');

  /** Row to flash after "Save & Close" on New Claimant. */
  protected readonly highlight: string | undefined = history.state?.highlight;
  protected readonly filter = signal<QueueFilter>('all');
  protected readonly pendingTrash = signal<InboxItem | null>(null);

  protected readonly today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  protected readonly greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  })();

  protected count(f: QueueFilter): number {
    const q = this.ws.queue();
    if (f === 'all') return q.length;
    if (f === 'flagged') return q.filter((i) => i.rush || i.rework).length;
    return q.filter((i) => i.status === f).length;
  }

  protected readonly filteredQueue = computed(() => {
    const f = this.filter();
    const q = this.ws.queue();
    return f === 'all' ? q : q.filter((i) => (f === 'flagged' ? i.rush || i.rework : i.status === f));
  });

  protected readonly pipeline = computed<PipelineCard[]>(() => {
    const f = this.filter();
    return [
      {
        eyebrow: 'Step 1 · Intake',
        label: 'New broker emails',
        value: this.ws.inbox().filter((i) => !i.replied).length,
        icon: InboxIcon,
        tone: 'neutral',
        hint: 'Requests in the SS Medicals inbox you haven’t replied to yet.',
        action: 'Review inbox',
        run: () => this.scrollTo(this.inboxEl())
      },
      {
        eyebrow: 'Step 2 · Underwrite',
        label: 'Ready for underwriting',
        value: this.count('Ready for UW'),
        icon: StethoscopeIcon,
        tone: 'brand',
        hint: 'Cases waiting for a rated age from the life expectancy table.',
        action: f === 'Ready for UW' ? 'Showing below · clear' : 'Show cases',
        active: f === 'Ready for UW',
        run: () => this.showQueue('Ready for UW')
      },
      {
        eyebrow: 'Step 3 · Confirm',
        label: 'Rated, not yet sent',
        value: this.count('Rated*'),
        badge: this.count('Rated*') ? 'Needs action' : undefined,
        icon: ClipboardCheckIcon,
        tone: 'warning',
        hint: 'RA confirmation sheet is ready — send it to the broker.',
        action: f === 'Rated*' ? 'Showing below · clear' : 'Show cases',
        active: f === 'Rated*',
        run: () => this.showQueue('Rated*')
      },
      {
        eyebrow: 'Step 4 · Done',
        label: 'Sent to broker',
        value: this.cases.all().filter((c) => c.status === 'CS Communicated').length,
        icon: SendIcon,
        tone: 'success',
        hint: 'RA confirmations delivered. Download or resend from Reports.',
        action: 'Open reports',
        run: () => this.router.navigate(['/reports'])
      }
    ];
  });

  protected readonly filters: { id: QueueFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'Ready for UW', label: 'Ready for UW' },
    { id: 'Rated*', label: 'Rated, not sent' },
    { id: 'flagged', label: 'Rush / Rework' }
  ];

  protected readonly queueColumns: Column<QueueItem>[] = [
    { key: 'rush', header: 'Rush', className: 'w-16', sortValue: (r) => (r.rush ? 1 : 0) },
    { key: 'rework', header: 'Rework', className: 'w-20', sortValue: (r) => (r.rework ? 1 : 0) },
    { key: 'case', header: 'Case #', sortValue: (r) => r.caseNumber, value: (r) => r.caseNumber, className: 'tabular-nums' },
    { key: 'claimant', header: 'Claimant', sortValue: (r) => r.claimant },
    { key: 'dob', header: 'DOB', sortValue: (r) => r.dob, value: (r) => r.dob, className: 'tabular-nums' },
    { key: 'received', header: 'Date Received', sortValue: (r) => dateSort(r.dateReceived), value: (r) => r.dateReceived, className: 'whitespace-nowrap tabular-nums' },
    { key: 'sender', header: 'Sender', sortValue: (r) => r.sender },
    { key: 'status', header: 'Status', sortValue: (r) => r.status }
  ];

  protected readonly inboxColumns: Column<InboxItem>[] = [
    { key: 'replied', header: 'Replied', hideHeaderLabel: true, className: 'w-10' },
    { key: 'from', header: 'From', sortValue: (r) => r.fromName },
    { key: 'subject', header: 'Subject', sortValue: (r) => r.subject },
    { key: 'received', header: 'Received On', sortValue: (r) => dateSort(r.receivedOn), value: (r) => r.receivedOn, className: 'whitespace-nowrap tabular-nums' },
    { key: 'status', header: 'Status' },
    { key: 'trash', header: 'Trash', className: 'w-16 text-center' }
  ];

  protected readonly secondaryColumns: Column<SecondaryReviewItem>[] = [
    { key: 'rush', header: 'Rush', sortValue: (r) => (r.rush ? 1 : 0) },
    { key: 'rework', header: 'Rework', sortValue: (r) => (r.rework ? 1 : 0) },
    { key: 'case', header: 'Case #', sortValue: (r) => r.caseNumber, value: (r) => r.caseNumber },
    { key: 'claimant', header: 'Claimant', sortValue: (r) => r.claimant, value: (r) => r.claimant },
    { key: 'received', header: 'Date Received', sortValue: (r) => r.dateReceived, value: (r) => r.dateReceived },
    { key: 'sender', header: 'Sender', sortValue: (r) => r.sender, value: (r) => r.sender },
    { key: 'underwriter', header: 'Underwriter', sortValue: (r) => r.underwriter, value: (r) => r.underwriter }
  ];

  protected readonly returnColumns: Column<ReturnEmailItem>[] = [
    { key: 'from', header: 'From', sortValue: (r) => r.from, value: (r) => r.from },
    { key: 'subject', header: 'Subject', sortValue: (r) => r.subject, value: (r) => r.subject },
    { key: 'received', header: 'Received On', sortValue: (r) => r.receivedOn, value: (r) => r.receivedOn },
    { key: 'actions', header: 'Actions', hideHeaderLabel: true }
  ];

  protected readonly secondaryReviewItems = secondaryReviewItems;
  protected readonly returnEmailReceipts = returnEmailReceipts;

  protected readonly queueId = (r: QueueItem) => r.id;
  protected readonly queueText = (r: QueueItem) => `${r.caseNumber} ${r.claimant} ${r.dob} ${r.dateReceived} ${r.sender} ${r.status}`;
  protected readonly queueRowClass = (r: QueueItem) => (r.id === this.highlight ? 'bg-success-50' : undefined);
  protected readonly inboxId = (r: InboxItem) => r.id;
  protected readonly inboxText = (r: InboxItem) => `${r.fromName} ${r.fromEmail} ${r.subject} ${r.receivedOn}`;
  protected readonly secondaryId = (r: SecondaryReviewItem) => r.id;
  protected readonly secondaryText = (r: SecondaryReviewItem) => `${r.caseNumber} ${r.claimant} ${r.sender} ${r.underwriter}`;
  protected readonly returnId = (r: ReturnEmailItem) => r.id;
  protected readonly returnText = (r: ReturnEmailItem) => `${r.from} ${r.subject} ${r.receivedOn}`;

  protected readonly i = { ChartLineIcon, FlagIcon, MailIcon, ReplyIcon, Trash2Icon, XIcon };

  protected splitSender(value: string): [string, string | undefined] {
    const [name, email] = value.split(' (');
    return [name, email];
  }

  protected chipClass(active: boolean): string {
    return cn('focus-ring inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors duration-150', active ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-700 hover:bg-ink-200');
  }

  protected showQueue(f: QueueFilter): void {
    this.filter.update((cur) => (cur === f ? 'all' : f));
    this.scrollTo(this.queueEl());
  }

  protected confirmTrash(): void {
    const item = this.pendingTrash();
    if (!item) return;
    const index = this.ws.inbox().findIndex((i) => i.id === item.id);
    this.ws.trashInbox(item.id);
    this.pendingTrash.set(null);
    toast('Email moved to trash', { description: item.subject, action: { label: 'Undo', onClick: () => this.ws.restoreInbox(item, index) } });
  }

  private scrollTo(el: ElementRef<HTMLElement> | undefined): void {
    el?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
