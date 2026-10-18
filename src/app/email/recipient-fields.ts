import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InfoIcon, LucideAngularModule } from 'lucide-angular';
import { Recipients } from '../core/types/workspace';
import { Control, SelectShell } from '../shared/ui';
import { RecipientInput } from './recipient-input';
import { Tooltip } from '../shared/ui/tooltip';

@Component({
  selector: 'app-recipient-fields',
  imports: [Tooltip, FormsModule, LucideAngularModule, Control, SelectShell, RecipientInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <fieldset class="rounded-lg border border-ink-200 p-4">
      <legend class="px-1 text-sm font-semibold text-ink-900">Recipient(s)</legend>
      <div class="space-y-3">
        <p class="text-xs font-semibold text-ink-700">Email</p>
        <div class="grid gap-x-3 gap-y-1 sm:grid-cols-[48px_minmax(0,1fr)] sm:items-center">
          <label [for]="idPrefix() + '-from'" class="text-[13px] font-medium text-ink-700 sm:text-right">From</label>
          <div class="flex items-center gap-2">
            <app-select class="w-full max-w-sm">
              <select appControl [id]="idPrefix() + '-from'" [ngModel]="value().from" (ngModelChange)="set('from', $event)">
                @for (o of fromOptions(); track o) {
                  <option [value]="o">{{ o }}</option>
                }
              </select>
            </app-select>
            <span appTooltip="Replies are sent from the selected shared mailbox" tabindex="0" class="focus-ring inline-flex rounded text-brand-600">
              <lucide-icon [img]="InfoIcon" class="h-4 w-4" aria-hidden="true" />
              <span class="sr-only">Replies are sent from the selected shared mailbox</span>
            </span>
          </div>
        </div>
        <app-recipient-input [id]="idPrefix() + '-to'" label="To" [values]="value().to" (valuesChange)="set('to', $event)" [error]="toError()" />
        <app-recipient-input [id]="idPrefix() + '-cc'" label="Cc" [values]="value().cc" (valuesChange)="set('cc', $event)" />
        <app-recipient-input [id]="idPrefix() + '-bcc'" label="Bcc" [values]="value().bcc" (valuesChange)="set('bcc', $event)" />
        <p class="border-t border-ink-100 pt-3 text-xs font-semibold text-ink-700">Fax</p>
        <app-recipient-input [id]="idPrefix() + '-fax'" label="To" [values]="value().fax" (valuesChange)="set('fax', $event)" />
      </div>
    </fieldset>
  `
})
export class RecipientFields {
  readonly idPrefix = input.required<string>();
  readonly value = model.required<Recipients>();
  readonly fromOptions = input.required<string[]>();
  readonly toError = input<string>();
  protected readonly InfoIcon = InfoIcon;

  protected set<K extends keyof Recipients>(key: K, v: Recipients[K]): void {
    this.value.set({ ...this.value(), [key]: v });
  }
}
