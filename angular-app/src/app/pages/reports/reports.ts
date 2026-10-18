import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ClipboardCheckIcon, DownloadIcon, EyeIcon, FileTextIcon, HourglassIcon, SendIcon, TrendingUpIcon } from 'lucide-angular';
import { CaseService } from '../../core/services/case.service';
import { RaSheetService } from '../../core/services/ra-sheet.service';
import { CaseRecord } from '../../core/types/case';
import { cn } from '../../core/utils/cn';
import { parseUSDate } from '../../core/utils/date';
import { raFileName } from '../../core/utils/raSheet';
import { Cell, Column, DataTable } from '../../shared/data-table';
import { Button, IconButton, Panel, StatCard, StatusBadge } from '../../shared/ui';
import { Tooltip } from '../../shared/ui/tooltip';

type ReportFilter = 'all' | 'pending' | 'sent';

const dateSort = (v: string) => parseUSDate(v)?.getTime() ?? 0;

/** Every RA confirmation sheet in one place: preview, download the PDF, or send it to the broker. */
@Component({
  selector: 'app-reports',
  imports: [Tooltip, RouterLink, DataTable, Cell, Button, IconButton, Panel, StatCard, StatusBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reports.html'
})
export class Reports {
  private readonly cases = inject(CaseService);
  private readonly router = inject(Router);
  protected readonly raSheet = inject(RaSheetService);
  protected readonly filter = signal<ReportFilter>('all');

  protected readonly rated = computed(() => this.cases.all().filter((c) => c.rating));
  protected readonly inUnderwriting = computed(() => this.cases.all().length - this.rated().length);
  protected readonly sent = computed(() => this.rated().filter((c) => c.status === 'CS Communicated'));
  protected readonly pending = computed(() => this.rated().filter((c) => c.status !== 'CS Communicated'));
  protected readonly rows = computed(() => ({ all: this.rated(), sent: this.sent(), pending: this.pending() })[this.filter()]);
  protected readonly avgUp = computed(() => {
    const list = this.rated();
    return list.length ? list.reduce((s, c) => s + (c.rating!.finalRatedAge - c.rating!.age), 0) / list.length : 0;
  });
  protected readonly byBroker = computed(() => {
    const counts = this.rated().reduce<Record<string, number>>((acc, c) => ({ ...acc, [c.broker.firm]: (acc[c.broker.firm] ?? 0) + 1 }), {});
    const list = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const max = Math.max(1, ...list.map(([, n]) => n));
    return list.map(([firm, n]) => ({ firm, n, pct: (n / max) * 100 }));
  });
  protected readonly filters = computed(() => [
    { id: 'all' as const, label: 'All', n: this.rated().length },
    { id: 'pending' as const, label: 'Not sent yet', n: this.pending().length },
    { id: 'sent' as const, label: 'Sent to broker', n: this.sent().length }
  ]);

  protected readonly columns: Column<CaseRecord>[] = [
    { key: 'claimant', header: 'Claimant', sortValue: (c) => c.claimantName },
    { key: 'broker', header: 'Broker', sortValue: (c) => c.broker.firm },
    { key: 'rated', header: 'Rated age', sortValue: (c) => c.rating!.finalRatedAge },
    { key: 'evaluated', header: 'Evaluated', sortValue: (c) => dateSort(c.rating!.dateEvaluated), value: (c) => c.rating!.dateEvaluated, className: 'tabular-nums' },
    { key: 'valid', header: 'Valid through', sortValue: (c) => dateSort(c.rating!.expirationDate), value: (c) => c.rating!.expirationDate, className: 'tabular-nums' },
    { key: 'status', header: 'Status', sortValue: (c) => c.status },
    { key: 'actions', header: 'Actions', className: 'w-px whitespace-nowrap text-right' }
  ];
  protected readonly rowId = (c: CaseRecord) => c.caseNumber;
  protected readonly searchText = (c: CaseRecord) => `${c.caseNumber} ${c.claimantName} ${c.broker.firm} ${c.broker.contact} ${c.status}`;
  protected readonly raFileName = raFileName;
  protected readonly i = { ClipboardCheckIcon, DownloadIcon, EyeIcon, FileTextIcon, HourglassIcon, SendIcon, TrendingUpIcon };

  protected toggle(f: ReportFilter): void {
    this.filter.update((cur) => (cur === f ? 'all' : f));
  }

  protected open(c: CaseRecord, path: string): void {
    this.router.navigate(['/case', c.caseNumber, path]);
  }

  protected chipClass(active: boolean): string {
    return cn('focus-ring inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors duration-150', active ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-700 hover:bg-ink-200');
  }
}
