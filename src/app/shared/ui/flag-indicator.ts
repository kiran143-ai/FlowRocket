import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FlagIcon, LucideAngularModule } from 'lucide-angular';

import { Tooltip } from './tooltip';

@Component({
  selector: 'app-flag-indicator',
  imports: [Tooltip, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (active()) {
      <span class="inline-flex items-center" [appTooltip]="label()">
        <lucide-icon
          [img]="FlagIcon"
          aria-hidden="true"
          [class]="kind() === 'rush' ? 'h-4 w-4 fill-danger-500 text-danger-600' : 'h-4 w-4 fill-warning-500 text-warning-600'" />
        <span class="sr-only">{{ label() }}</span>
      </span>
    } @else {
      <span class="sr-only">No</span>
    }
  `
})
export class FlagIndicator {
  readonly kind = input.required<'rush' | 'rework'>();
  readonly active = input(false);
  protected readonly FlagIcon = FlagIcon;
  protected label = () => (this.kind() === 'rush' ? 'Rush' : 'Rework');
}
