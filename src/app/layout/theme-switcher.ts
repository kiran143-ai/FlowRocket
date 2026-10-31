import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toast } from 'ngx-sonner';
import { PALETTES, PaletteId, ThemeId, ThemeService, THEMES } from '../core/services/theme.service';
import { cn } from '../core/utils/cn';

const swatch: Record<ThemeId, string> = { classic: '#2369A8', evergreen: '#0F6B66' };

/** Segmented control that flips the whole app between the Classic and Evergreen versions. */
@Component({
  selector: 'app-theme-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'group', 'aria-label': 'Choose application version', '[class]': 'groupClass()' },
  template: `
    @for (t of themes; track t.id) {
      <button
        type="button"
        [attr.aria-pressed]="theme.theme() === t.id"
        [attr.title]="t.description"
        [class]="btnClass(t.id)"
        (click)="choose(t.id)">
        <span class="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-black/10" [style.background]="swatch[t.id]" aria-hidden="true"></span>
        <span [class]="labelClass()">{{ t.label }}</span>
      </button>
    }
  `
})
export class ThemeSwitcher {
  /** `onBrand` sits on the Classic blue header; `default` on light surfaces. */
  readonly tone = input<'onBrand' | 'default'>('default');
  protected readonly theme = inject(ThemeService);
  protected readonly themes = THEMES;
  protected readonly swatch = swatch;

  /** Labels collapse to the colour dots when space is tight; the name stays available to screen readers. */
  protected readonly labelClass = computed(() => (this.tone() === 'onBrand' ? 'max-xl:sr-only' : 'max-sm:sr-only'));

  protected readonly groupClass = computed(() =>
    cn('inline-flex items-center gap-0.5 rounded-lg p-0.5', this.tone() === 'onBrand' ? 'bg-white/15' : 'border border-ink-200 bg-ink-50')
  );

  protected btnClass(id: ThemeId): string {
    const active = this.theme.theme() === id;
    const onBrand = this.tone() === 'onBrand';
    return cn(
      'focus-ring inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-semibold transition-colors duration-150',
      onBrand ? 'focus-visible:ring-white focus-visible:ring-offset-brand-600' : '',
      active ? (onBrand ? 'bg-white text-brand-700 shadow-xs' : 'bg-white text-brand-700 shadow-xs ring-1 ring-ink-200') : onBrand ? 'text-white/90 hover:bg-white/15' : 'text-ink-500 hover:text-ink-900'
    );
  }

  protected choose(id: ThemeId): void {
    if (this.theme.theme() === id) return;
    this.theme.set(id);
    toast(`${THEMES.find((t) => t.id === id)!.label} version`, { description: THEMES.find((t) => t.id === id)!.description });
  }
}

/** Colour palette for the Evergreen layout (Green or Corporate Blue). */
@Component({
  selector: 'app-palette-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'group', 'aria-label': 'Choose colour palette', class: 'inline-flex items-center gap-0.5 rounded-lg border border-ink-200 bg-ink-50 p-0.5' },
  template: `
    @for (p of palettes; track p.id) {
      <button
        type="button"
        [attr.aria-pressed]="theme.palette() === p.id"
        [attr.title]="p.description"
        [class]="btnClass(p.id)"
        (click)="choose(p.id)">
        <span class="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-black/10" [style.background]="p.swatch" aria-hidden="true"></span>
        <span class="max-2xl:sr-only">{{ p.label }}</span>
      </button>
    }
  `
})
export class PaletteSwitcher {
  protected readonly theme = inject(ThemeService);
  protected readonly palettes = PALETTES;

  protected btnClass(id: PaletteId): string {
    const active = this.theme.palette() === id;
    return cn(
      'focus-ring inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-semibold transition-colors duration-150',
      active ? 'bg-white text-brand-700 shadow-xs ring-1 ring-ink-200' : 'text-ink-500 hover:text-ink-900'
    );
  }

  protected choose(id: PaletteId): void {
    if (this.theme.palette() === id) return;
    this.theme.setPalette(id);
    toast(`${PALETTES.find((p) => p.id === id)!.label} palette`, { description: PALETTES.find((p) => p.id === id)!.description });
  }
}
