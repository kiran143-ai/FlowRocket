import { computed, effect, Injectable, signal } from '@angular/core';

export type ThemeId = 'classic' | 'evergreen';

export const THEMES: { id: ThemeId; label: string; description: string }[] = [
  { id: 'classic', label: 'Classic', description: 'Blue header with two-tier navigation' },
  { id: 'evergreen', label: 'SSTL', description: 'Left-sidebar workspace layout' }
];

export type PaletteId = 'green' | 'blue';

/** Colour palettes for the SSTL layout. Classic ignores the palette. */
export const PALETTES: { id: PaletteId; label: string; description: string; swatch: string }[] = [
  { id: 'green', label: 'Green', description: 'Deep teal-green palette', swatch: '#0F6B66' },
  { id: 'blue', label: 'SSTL Blue', description: 'Deep blue palette with sky-blue accent', swatch: '#005C92' }
];

const STORAGE_KEY = 'flowrocket:theme';
const PALETTE_KEY = 'flowrocket:palette';
const isPalette = (v: unknown): v is PaletteId => v === 'green' || v === 'blue';
const isTheme = (v: unknown): v is ThemeId => v === 'classic' || v === 'evergreen';

/**
 * Which look and layout is active. The theme is an attribute on <html> (`data-theme`), which swaps the
 * CSS variables in styles.css; layout-level differences read `isEvergreen()`.
 * A `?theme=evergreen` link wins over the saved choice so a specific version can be shared.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<ThemeId>(this.initial());
  readonly palette = signal<PaletteId>(this.initialPalette());
  readonly isEvergreen = computed(() => this.theme() === 'evergreen');

  constructor() {
    effect(() => {
      const palette = this.palette();
      document.documentElement.dataset['palette'] = palette;
      try {
        localStorage.setItem(PALETTE_KEY, palette);
      } catch {
        /* storage can be blocked; the choice just won't persist */
      }
    });
    effect(() => {
      const theme = this.theme();
      document.documentElement.dataset['theme'] = theme;
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        /* storage can be blocked; the choice just won't persist */
      }
    });
  }

  setPalette(palette: PaletteId): void {
    this.palette.set(palette);
  }

  set(theme: ThemeId): void {
    this.theme.set(theme);
  }

  private initial(): ThemeId {
    try {
      const fromUrl = new URLSearchParams(location.search).get('theme');
      if (isTheme(fromUrl)) return fromUrl;
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isTheme(saved)) return saved;
    } catch {
      /* fall through to the default */
    }
    return 'classic';
  }

  private initialPalette(): PaletteId {
    try {
      const fromUrl = new URLSearchParams(location.search).get('palette');
      if (isPalette(fromUrl)) return fromUrl;
      const saved = localStorage.getItem(PALETTE_KEY);
      if (isPalette(saved)) return saved;
    } catch {
      /* fall through to the default */
    }
    return 'green';
  }
}
