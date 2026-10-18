import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChevronsRightIcon, LoaderCircleIcon, LucideAngularModule, SearchIcon } from 'lucide-angular';
import { existingClaimants } from '../core/data/claimants';
import { WorkspaceService } from '../core/services/workspace.service';
import { ExistingClaimant } from '../core/types/workspace';
import { formatUSDate, parseUSDate } from '../core/utils/date';
import { Cell, Column, DataTable } from '../shared/data-table';
import { Alert, Button, Choice, Control, Field, SelectShell } from '../shared/ui';

@Component({
  selector: 'app-claimant-search',
  imports: [FormsModule, LucideAngularModule, DataTable, Cell, Alert, Button, Choice, Control, Field, SelectShell],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './claimant-search.html',
  host: { class: 'flex h-full flex-col' }
})
export class ClaimantSearch {
  readonly newClaimant = output<void>();
  readonly openClaimant = output<ExistingClaimant>();
  private readonly ws = inject(WorkspaceService);

  protected name = '';
  protected dob = '';
  protected caseNo = '';
  protected years = 'all';
  protected readonly formError = signal<string | null>(null);
  protected readonly dobError = signal<string | null>(null);
  protected readonly status = signal<'idle' | 'searching' | 'done'>('idle');
  protected readonly results = signal<ExistingClaimant[]>([]);
  protected readonly selectedId = signal<string | null>(null);
  protected readonly selected = computed(() => this.results().find((r) => r.id === this.selectedId()));
  private timer?: ReturnType<typeof setTimeout>;

  private readonly pool = computed<ExistingClaimant[]>(() => [
    ...existingClaimants,
    ...this.ws
      .queue()
      .filter((q) => !existingClaimants.some((c) => c.caseNumber === q.caseNumber))
      .map((q) => {
        const parts = q.claimant.replace(/\s*\(\d+\)$/, '').split(' ');
        return { id: q.id, name: `${parts.slice(1).join(' ')}, ${parts[0]}`, dob: q.dob, brokers: q.sender.split(' (')[0], caseNumber: q.caseNumber };
      })
  ]);

  protected readonly columns: Column<ExistingClaimant>[] = [
    { key: 'select', header: 'Select', hideHeaderLabel: true, className: 'w-10' },
    { key: 'claimant', header: 'Claimant', sortValue: (r) => r.name },
    { key: 'brokers', header: 'Broker(s)', sortValue: (r) => r.brokers, value: (r) => r.brokers }
  ];
  protected readonly rowId = (r: ExistingClaimant) => r.id;
  protected readonly searchText = (r: ExistingClaimant) => `${r.name} ${r.brokers}`;
  protected readonly icons = { ChevronsRightIcon, LoaderCircleIcon, SearchIcon };

  protected search(): void {
    this.formError.set(null);
    this.dobError.set(null);
    if (!this.name.trim() && !this.dob.trim() && !this.caseNo.trim()) {
      this.formError.set('Enter a claimant name, DOB, or GRA/Case number to search.');
      return;
    }
    const dobDate = this.dob.trim() ? parseUSDate(this.dob) : null;
    if (this.dob.trim() && !dobDate) {
      this.dobError.set('Use the format MM/DD/YYYY.');
      return;
    }
    this.status.set('searching');
    this.selectedId.set(null);
    this.timer = setTimeout(() => {
      const tokens = this.name.trim().toLowerCase().split(/[\s,]+/).filter(Boolean);
      const caseNo = this.caseNo.trim();
      this.results.set(
        this.pool().filter((c) => {
          const n = c.name.toLowerCase();
          return tokens.every((t) => n.includes(t)) && (!dobDate || c.dob === formatUSDate(dobDate)) && (!caseNo || c.caseNumber.includes(caseNo));
        })
      );
      this.status.set('done');
    }, 500);
  }

  protected cancel(): void {
    clearTimeout(this.timer);
    this.name = this.dob = this.caseNo = '';
    this.years = 'all';
    this.formError.set(null);
    this.dobError.set(null);
    this.results.set([]);
    this.selectedId.set(null);
    this.status.set('idle');
  }
}
