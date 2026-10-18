import { NgTemplateOutlet } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  BellIcon,
  ChartLineIcon,
  ChevronDownIcon,
  FileTextIcon,
  HistoryIcon,
  HourglassIcon,
  HouseIcon,
  LogOutIcon,
  LucideAngularModule,
  MinusIcon,
  RefreshCwIcon,
  ReplyIcon,
  SaveIcon,
  SearchIcon,
  Trash2Icon,
  TriangleAlertIcon,
  UserIcon,
  XIcon
} from 'lucide-angular';
import { CaseToolbar } from '../../case/case-toolbar';
import { a11yGuidelines, colorGroups, flaggedChanges, spacingScale, typeScale } from '../../core/data/designTokens';
import { workQueue } from '../../core/data/workQueue';
import { QueueItem } from '../../core/types/workspace';
import { Cell, Column, DataTable } from '../../shared/data-table';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  ButtonVariant,
  Choice,
  choiceInput,
  Control,
  Field,
  FlagIndicator,
  IconButton,
  InputIcon,
  Modal,
  Panel,
  SelectShell,
  StatusBadge,
  Tabs
} from '../../shared/ui';

@Component({
  selector: 'app-design-system',
  imports: [
    NgTemplateOutlet,
    LucideAngularModule,
    CaseToolbar,
    DataTable,
    Cell,
    Alert,
    Avatar,
    Badge,
    Button,
    Choice,
    Control,
    Field,
    FlagIndicator,
    IconButton,
    InputIcon,
    Modal,
    Panel,
    SelectShell,
    StatusBadge,
    Tabs
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './design-system.html'
})
export class DesignSystem {
  private readonly router = inject(Router);
  private readonly content = viewChild.required<ElementRef<HTMLElement>>('content');
  /** Section currently in view, highlighted in the sidebar. */
  protected readonly active = signal('color');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const sections = Array.from(this.content().nativeElement.querySelectorAll<HTMLElement>('section[id]'));
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible[0]) this.active.set(visible[0].target.id);
        },
        // A band just below the sticky header counts as "current".
        { rootMargin: '-120px 0px -65% 0px' }
      );
      sections.forEach((s) => observer.observe(s));
      destroyRef.onDestroy(() => observer.disconnect());

      const fragment = this.router.parseUrl(this.router.url).fragment;
      if (fragment) setTimeout(() => this.scrollTo(fragment, 'auto'));
    });
  }

  /** Smooth-scroll in place and keep the URL fragment shareable, without re-running navigation. */
  protected jump(e: MouseEvent, id: string): void {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    this.scrollTo(id, 'smooth');
    this.active.set(id);
    history.replaceState(history.state, '', `/design-system#${id}`);
  }

  private scrollTo(id: string, behavior: ScrollBehavior): void {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior, block: 'start' });
    el.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
  }

  protected readonly toc: { group: string; items: [string, string][] }[] = [
    { group: 'Foundations', items: [['color', 'Color'], ['typography', 'Typography'], ['spacing', 'Spacing & elevation'], ['layout', 'Layout & grid']] },
    { group: 'Controls', items: [['buttons', 'Buttons'], ['inputs', 'Inputs'], ['dropdowns', 'Dropdowns & choices']] },
    { group: 'Display', items: [['tables', 'Data tables'], ['badges', 'Badges & status'], ['alerts', 'Alerts & feedback'], ['cards', 'Cards, panels & tabs'], ['modals', 'Modals'], ['navigation', 'Navigation']] },
    { group: 'Guidance', items: [['accessibility', 'Accessibility'], ['review', 'Flagged for review']] }
  ];

  protected readonly colorGroups = colorGroups;
  protected readonly typeScale = typeScale;
  protected readonly spacingScale = spacingScale;
  protected readonly a11yGuidelines = a11yGuidelines;
  protected readonly flaggedChanges = flaggedChanges;
  protected readonly workQueue = workQueue;
  protected readonly choiceInput = choiceInput;

  protected readonly radii = [
    ['rounded', '4px', 'Chips, toolbar buttons'],
    ['rounded-md', '6px', 'Inputs, buttons'],
    ['rounded-lg', '8px', 'Panels, cards'],
    ['rounded-xl', '12px', 'Dialogs']
  ];

  protected readonly variants: { variant: ButtonVariant; name: string; usage: string; hover: string; active: string }[] = [
    { variant: 'primary', name: 'Primary', usage: 'One per view: Save & Close, Search, Send', hover: '!bg-brand-700', active: '!bg-brand-800' },
    { variant: 'secondary', name: 'Secondary', usage: 'Save & Open, Reply, Next »', hover: '!bg-ink-50 !border-ink-300', active: '!bg-ink-100' },
    { variant: 'ghost', name: 'Ghost', usage: 'Previous / Next, header links', hover: '!bg-ink-100 !text-ink-900', active: '!bg-ink-200' },
    { variant: 'danger', name: 'Danger', usage: 'Cancel, Trash', hover: '!bg-danger-50 !border-danger-500', active: '!bg-danger-100' }
  ];
  protected readonly focus = 'ring-2 ring-brand-500 ring-offset-2';
  protected readonly states = ['Default', 'Hover', 'Focus', 'Active', 'Disabled', 'Loading'];

  protected readonly columns: Column<QueueItem>[] = [
    { key: 'rush', header: 'Rush', sortValue: (r) => (r.rush ? 1 : 0) },
    { key: 'rework', header: 'Rework', sortValue: (r) => (r.rework ? 1 : 0) },
    { key: 'case', header: 'Case #', sortValue: (r) => r.caseNumber, value: (r) => r.caseNumber },
    { key: 'claimant', header: 'Claimant', sortValue: (r) => r.claimant },
    { key: 'status', header: 'Status', sortValue: (r) => r.status }
  ];
  protected readonly rowId = (r: QueueItem) => r.id;
  protected readonly searchText = (r: QueueItem) => `${r.caseNumber} ${r.claimant} ${r.status}`;

  protected readonly tab = signal('ra');
  protected readonly tabs = [
    { id: 'ra', label: 'RA Confirmation Sheet', icon: FileTextIcon },
    { id: 'timeline', label: 'Timeline', icon: HistoryIcon }
  ];
  protected readonly modal = signal(false);

  protected readonly i = {
    BellIcon,
    ChartLineIcon,
    ChevronDownIcon,
    HourglassIcon,
    HouseIcon,
    LogOutIcon,
    MinusIcon,
    RefreshCwIcon,
    ReplyIcon,
    SaveIcon,
    SearchIcon,
    Trash2Icon,
    TriangleAlertIcon,
    UserIcon,
    XIcon
  };
}
