import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, LucideIconData, MinusIcon, RefreshCwIcon, XIcon } from 'lucide-angular';
import { toast } from 'ngx-sonner';
import { IconButton } from '../shared/ui';

@Component({
  selector: 'app-window-bar',
  imports: [LucideAngularModule, IconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex h-11 items-center justify-between gap-3 border-b border-ink-200 bg-white px-4 lg:px-6' },
  template: `
    <p class="flex min-w-0 items-center gap-2 text-[15px] font-semibold text-brand-800">
      @if (icon()) {
        <lucide-icon [img]="icon()!" class="h-4 w-4 text-brand-600" aria-hidden="true" />
      }
      <span class="truncate">{{ heading() }}</span>
    </p>
    <div class="flex items-center gap-0.5">
      <button appIconButton label="Refresh" size="sm" [icon]="RefreshCwIcon" (click)="refresh()"></button>
      <button appIconButton label="Minimize to Home Workspace" size="sm" [icon]="MinusIcon" (click)="home()"></button>
      <button appIconButton label="Close" size="sm" variant="danger" [icon]="XIcon" (click)="home()"></button>
    </div>
  `
})
export class WindowBar {
  readonly heading = input.required<string>();
  readonly icon = input<LucideIconData>();
  private readonly router = inject(Router);
  protected readonly RefreshCwIcon = RefreshCwIcon;
  protected readonly MinusIcon = MinusIcon;
  protected readonly XIcon = XIcon;

  protected refresh(): void {
    toast.success('Up to date');
  }

  protected home(): void {
    this.router.navigate(['/']);
  }
}
