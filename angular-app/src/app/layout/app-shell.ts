import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  BellIcon,
  ChartLineIcon,
  ChevronDownIcon,
  CirclePlusIcon,
  HouseIcon,
  ListIcon,
  LogOutIcon,
  LucideAngularModule,
  MessageCircleIcon,
  MonitorIcon,
  PaletteIcon,
  RocketIcon,
  SearchIcon,
  UserIcon
} from 'lucide-angular';
import { toast } from 'ngx-sonner';
import { currentUrl } from '../core/services/current-url';
import { cn } from '../core/utils/cn';
import { IconButton } from '../shared/ui';

const navText =
  'focus-ring inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 text-sm font-medium text-white/90 transition-colors duration-150 hover:bg-white/15 hover:text-white focus-visible:ring-white focus-visible:ring-offset-brand-600';
const subNav = cn(navText, 'h-7 focus-visible:ring-offset-brand-700');

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, LucideAngularModule, IconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app-shell.html'
})
export class AppShell {
  private readonly url = currentUrl();
  protected readonly onDesignSystem = computed(() => this.url().startsWith('/design-system'));
  protected readonly onReports = computed(() => this.url().startsWith('/reports'));
  protected readonly onHome = computed(() => !this.onDesignSystem() && !this.onReports());

  protected readonly navText = navText;
  protected readonly cn = cn;
  protected subNav = (active: boolean) => cn(subNav, active && 'bg-white/15 text-white');

  protected readonly icons = {
    BellIcon,
    ChartLineIcon,
    ChevronDownIcon,
    CirclePlusIcon,
    HouseIcon,
    ListIcon,
    LogOutIcon,
    MessageCircleIcon,
    MonitorIcon,
    PaletteIcon,
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
