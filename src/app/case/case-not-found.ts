import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FileXIcon, LucideIconData } from 'lucide-angular';
import { EmptyState } from '../shared/ui';

@Component({
  selector: 'app-not-found',
  imports: [EmptyState, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-empty-state [icon]="icon()" [heading]="heading()" [description]="description()">
      <a routerLink="/" class="link text-sm">Back to Home Workspace</a>
    </app-empty-state>
  `
})
export class NotFound {
  readonly heading = input('Case not found');
  readonly description = input<string>();
  readonly icon = input<LucideIconData>(FileXIcon);
}
