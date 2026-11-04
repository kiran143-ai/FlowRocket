import { ChangeDetectionStrategy, Component } from '@angular/core';

/** SSTL MediLife mark: a shield (protection, settlements) holding a medical cross. Takes the surrounding text colour. */
@Component({
  selector: 'app-logo-mark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="h-[20px] w-[20px]">
      <path d="M12 2.5 4.5 5.5v6c0 4.7 3.1 8.2 7.5 10 4.4-1.8 7.5-5.3 7.5-10v-6z" />
      <path d="M12 8.25v6.5M8.75 11.5h6.5" />
    </svg>
  `
})
export class LogoMark {}
