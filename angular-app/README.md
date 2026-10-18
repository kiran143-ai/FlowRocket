# FlowRocket — Angular

Angular 21 port of the FlowRocket medical underwriting prototype (the React version lives one level up in `../src`). Same screens, URLs, data and Tailwind design tokens.

```bash
npm install
npm start          # http://localhost:4200
npm run build      # production build → dist/angular-app
```

## Stack

- Angular 21, standalone components, signals, zoneless change detection, OnPush everywhere
- Angular Router with lazy-loaded pages; route params bind straight to component `input()`s (`withComponentInputBinding`)
- Tailwind CSS 3 (`tailwind.config.js`, same tokens as the React app)
- `lucide-angular` icons, `ngx-sonner` toasts, `jspdf` (lazy-loaded) for the RA Confirmation PDF

## Layout

```
src/app/
  core/        framework-free code shared with the React app
    types/     CaseRecord, QueueItem, …
    data/      mock cases, inbox, brokers, design tokens
    utils/     dates, rating calculation, RA sheet PDF, cn() class merger
    services/  WorkspaceService (app state), CaseService (case lookup), RaSheetService (PDF download)
  shared/      UI kit: button[appButton], button[appIconButton], app-panel, app-modal, app-tabs,
               app-stat-card, form controls (input[appControl], app-select, app-field), app-data-table
  layout/      app shell (two-tier header) and window bar
  case/        case layout, toolbar, timeline, Activity Sheet panels, case overview
  email/       email viewer, claimant search, recipient chips, rich text editor
  documents/   PDF viewer, RA confirmation page, scanned / Form 461 pages
  pages/       one folder per route
```

## Conventions

- **Extra classes on UI primitives** go in the selector attribute so Tailwind conflicts resolve correctly:
  `<button appButton="ml-1">`, `<input appControl="w-36">`, `<button appIconButton="text-brand-600">`.
- **Table cells**: define columns in the component, then override any cell with
  `<ng-template appCell="claimant" let-row>…</ng-template>` inside `<app-data-table>`.
- **Named slots**: `panelActions`, `modalFooter`, `columnActions`, `titleAction`, `headerExtra`, `toolbarExtra`, `toolbarAction`.
- **Icons**: `<lucide-icon [img]="SearchIcon" class="h-4 w-4" />`. The host is `display: contents`, so put
  conditional classes in a single `[class]` binding rather than `[class.foo]`.
