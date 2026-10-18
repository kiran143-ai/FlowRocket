import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { ChevronDownIcon, FileTextIcon, LucideAngularModule, MailIcon, MenuIcon, PrinterIcon } from 'lucide-angular';
import { toast } from 'ngx-sonner';
import { CaseRecord } from '../core/types/case';
import { Choice, choiceInput } from '../shared/ui';
import { ColumnPanel } from './column-panel';
import { Tooltip } from '../shared/ui/tooltip';

type SectionKey = 'claimant' | 'team' | 'rating';
type GroupKey = 'broker' | 'underwriters' | 'rating';

@Component({
  selector: 'app-summary-panel',
  imports: [Tooltip, ColumnPanel, LucideAngularModule, Choice, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './summary-panel.html'
})
export class SummaryPanel {
  readonly caseRecord = input.required<CaseRecord>();

  protected readonly included = signal<Record<SectionKey, boolean>>({ claimant: true, team: true, rating: true });
  protected readonly open = signal<Record<GroupKey, boolean>>({ broker: true, underwriters: true, rating: true });
  protected readonly all = computed(() => Object.values(this.included()).every(Boolean));
  protected readonly some = computed(() => Object.values(this.included()).some(Boolean));
  private readonly count = computed(() => Object.values(this.included()).filter(Boolean).length);

  protected readonly choiceInput = choiceInput;
  protected readonly headerBtn = 'focus-ring grid h-7 w-7 place-items-center rounded text-ink-500 transition-colors duration-150 hover:bg-ink-100 hover:text-ink-900';
  protected readonly icons = { ChevronDownIcon, FileTextIcon, MailIcon, MenuIcon, PrinterIcon };

  protected yn = (b: boolean) => (b ? 'Yes' : 'No');

  protected toggleAll(): void {
    const v = !this.all();
    this.included.set({ claimant: v, team: v, rating: v });
  }

  protected toggle(key: SectionKey): void {
    this.included.update((s) => ({ ...s, [key]: !s[key] }));
  }

  protected isOpen(key: string): boolean {
    return this.open()[key as GroupKey];
  }

  protected toggleGroup(key: string): void {
    this.open.update((o) => ({ ...o, [key]: !o[key as GroupKey] }));
  }

  protected output(kind: string): void {
    const n = this.count();
    if (n) toast.success(`${kind}: ${n} summary ${n === 1 ? 'section' : 'sections'}`);
    else toast.error('Select at least one summary section first.');
  }
}
