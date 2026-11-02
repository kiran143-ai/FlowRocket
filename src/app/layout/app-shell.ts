import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  BellIcon,
  BookUserIcon,
  CalendarIcon,
  ChartLineIcon,
  ChevronDownIcon,
  CircleQuestionMarkIcon,
  CirclePlusIcon,
  ClipboardListIcon,
  FolderOpenIcon,
  HouseIcon,
  InboxIcon,
  LayoutDashboardIcon,
  ListIcon,
  LogOutIcon,
  LucideAngularModule,
  LucideIconData,
  MessageCircleIcon,
  MonitorIcon,
  PaletteIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  RocketIcon,
  SearchIcon,
  SendIcon,
  UserIcon,
  WrenchIcon
} from 'lucide-angular';
import { toast } from 'ngx-sonner';
import { currentUrl } from '../core/services/current-url';
import { ThemeService } from '../core/services/theme.service';
import { WorkspaceService } from '../core/services/workspace.service';
import { cn } from '../core/utils/cn';
import { Avatar, IconButton } from '../shared/ui';
import { PaletteSwitcher, ThemeSwitcher } from './theme-switcher';

const navText =
  'focus-ring inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 text-sm font-medium text-white/90 transition-colors duration-150 hover:bg-white/15 hover:text-white focus-visible:ring-white focus-visible:ring-offset-brand-600';
const subNav = cn(navText, 'h-7 focus-visible:ring-offset-brand-700');

/** The case the sidebar's case shortcuts open (the seeded demo case). */
const DEFAULT_CASE = '26-01867';

interface SideLink {
  label: string;
  icon: LucideIconData;
  route: string;
  active: boolean;
  badge?: number;
}

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, LucideAngularModule, Avatar, IconButton, ThemeSwitcher, PaletteSwitcher],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app-shell.html'
})
export class AppShell {
  protected readonly theme = inject(ThemeService);
  private readonly ws = inject(WorkspaceService);
  private readonly url = currentUrl();
  protected readonly onDesignSystem = computed(() => this.url().startsWith('/design-system'));
  protected readonly onReports = computed(() => this.url().startsWith('/reports'));
  protected readonly onHome = computed(() => !this.onDesignSystem() && !this.onReports());

  /** SSTL sidebar: always an icon rail on narrow screens, and collapsible by the user above that. */
  protected readonly narrow = signal(false);
  private readonly userCollapsed = signal(false);
  protected readonly collapsed = computed(() => this.narrow() || this.userCollapsed());

  constructor() {
    const query = window.matchMedia('(max-width: 1099px)');
    this.narrow.set(query.matches);
    const onChange = (e: MediaQueryListEvent) => this.narrow.set(e.matches);
    query.addEventListener('change', onChange);
    inject(DestroyRef).onDestroy(() => query.removeEventListener('change', onChange));
  }

  protected toggleSidebar(): void {
    this.userCollapsed.update((v) => !v);
  }

  protected readonly unreplied = computed(() => this.ws.inbox().filter((i) => !i.replied).length);
  protected readonly sideLinks = computed<SideLink[]>(() => {
    const url = this.url();
    const inMessage = url.includes('/message');
    const inEmail = url.startsWith('/email') || url.startsWith('/document');
    const inCase = url.startsWith('/case/') && !inMessage;
    return [
      { label: 'Dashboard', icon: LayoutDashboardIcon, route: '/', active: url === '/' || url.startsWith('/?') },
      { label: 'Medicals inbox', icon: InboxIcon, route: `/email/${this.ws.inbox()[0]?.id ?? 'in-1'}`, active: inEmail, badge: this.unreplied() },
      { label: 'Case workspace', icon: FolderOpenIcon, route: `/case/${DEFAULT_CASE}`, active: inCase },
      { label: 'Broker emails', icon: SendIcon, route: `/case/${DEFAULT_CASE}/message`, active: inMessage },
      { label: 'Reports', icon: ClipboardListIcon, route: '/reports', active: this.onReports() }
    ];
  });
  protected readonly toolLinks: { label: string; icon: LucideIconData }[] = [
    { label: 'Address Book', icon: BookUserIcon },
    { label: 'Documents', icon: FolderOpenIcon },
    { label: 'Calendar', icon: CalendarIcon },
    { label: 'Tools', icon: WrenchIcon }
  ];

  protected readonly navText = navText;
  protected readonly cn = cn;
  protected subNav = (active: boolean) => cn(subNav, active && 'bg-white/15 text-white');

  /** Sidebar item: a dark-teal row with an amber marker on the current page. */
  protected sideItem = (active: boolean) =>
    cn(
      'focus-ring group relative flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors duration-150 focus-visible:ring-white focus-visible:ring-offset-brand-900 blue:focus-visible:ring-offset-brand-600',
      active ? 'bg-white/[0.12] text-white blue:bg-[#03A1FF] blue:text-brand-900' : 'text-white/75 hover:bg-white/[0.07] hover:text-white blue:text-white/90 blue:hover:bg-white/[0.12]',
      this.collapsed() && 'justify-center px-0'
    );

  protected readonly icons = {
    BellIcon,
    ChartLineIcon,
    ChevronDownIcon,
    CircleQuestionMarkIcon,
    CirclePlusIcon,
    HouseIcon,
    ListIcon,
    LogOutIcon,
    MessageCircleIcon,
    MonitorIcon,
    PaletteIcon,
    PanelLeftCloseIcon,
    PanelLeftOpenIcon,
    RocketIcon,
    SearchIcon,
    UserIcon
  };

  protected notInPrototype(name: string): void {
    toast(`${name} isn't part of this prototype.`);
  }

  protected notify(): void {
    toast('No new notifications');
  }
}
