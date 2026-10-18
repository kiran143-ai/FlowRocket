import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSonnerToaster],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <router-outlet />
    <ngx-sonner-toaster position="bottom-right" [richColors]="true" [closeButton]="true" />
  `
})
export class App {
  constructor() {
    // Keep anchor targets clear of the sticky two-row header (88px) plus breathing room.
    inject(ViewportScroller).setOffset([0, 112]);
  }
}
