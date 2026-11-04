import { ChangeDetectionStrategy, Component } from '@angular/core';

/** SSTL MedLink mark: a medical cross built from linked nodes (hub and four connections). Takes the surrounding text colour. */
@Component({
  selector: 'app-logo-mark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="h-[20px] w-[20px]">
      <circle cx="12" cy="12" r="2.6" />
      <circle cx="12" cy="4" r="2" />
      <circle cx="12" cy="20" r="2" />
      <circle cx="4" cy="12" r="2" />
      <circle cx="20" cy="12" r="2" />
      <path d="M12 6v3.4M12 14.6V18M6 12h3.4M14.6 12H18" />
    </svg>
  `
})
export class LogoMark {}
