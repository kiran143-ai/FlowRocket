# FlowRocket

Redesign prototype for FlowRocket, the structured settlements medical underwriting workspace: work queue, broker email triage, claimant intake, rated-age calculation, RA Confirmation Sheet (PDF) and broker communication.

Built with **Angular 21** and **Tailwind CSS**.

```bash
npm install
npm start          # http://localhost:4200
npm run build      # production build → dist/flowrocket/browser
```

Requires Node.js 20.19+, 22.12+ or 24+.

**Live:** deployed on Vercel. `vercel.json` sets the build and rewrites every route to `index.html`, so deep links such as `/reports` and `/case/26-01867` work.

## Stack

- Angular 21, standalone components, signals, zoneless change detection, OnPush everywhere
- Angular Router with lazy-loaded pages; route params bind straight to component `input()`s (`withComponentInputBinding`)
- Tailwind CSS 3 (`tailwind.config.js`) — design tokens documented live at `/design-system`
- Inter (Google Fonts) for the UI
- `lucide-angular` icons, `ngx-sonner` toasts, `jspdf` (lazy-loaded) for the RA Confirmation PDF

## Layout

```
src/app/
  core/        framework-free code
    types/     CaseRecord, QueueItem, …
    data/      mock cases, inbox, brokers, design tokens   ← replace with API calls
    utils/     dates, rating calculation, RA sheet PDF, cn() class merger
    services/  WorkspaceService (app state), CaseService (case lookup), RaSheetService (PDF download)
  shared/      UI kit: button[appButton], button[appIconButton], app-panel, app-modal, app-tabs,
               app-stat-card, [appTooltip], form controls (input[appControl], app-select, app-field),
               app-data-table
  layout/      app shell (two-tier header with FlowRocket logo) and window bar
  case/        case layout, toolbar, timeline, Activity Sheet panels, case overview
  email/       email viewer, claimant search, recipient chips, rich text editor
  documents/   PDF viewer, RA confirmation page, scanned / Form 461 pages
  pages/       one folder per route
public/brand/  New York Life logo (PNG for screen, JPEG for the PDF)
```

## Conventions

- **Extra classes on UI primitives** go in the selector attribute so Tailwind conflicts resolve correctly:
  `<button appButton="ml-1">`, `<input appControl="w-36">`, `<button appIconButton="text-brand-600">`.
- **Icon-only buttons** need a `label`; it becomes the accessible name and the tooltip (`tip` overrides the tooltip text).
- **Table cells**: define columns in the component, then override any cell with
  `<ng-template appCell="claimant" let-row>…</ng-template>` inside `<app-data-table>`.
- **Named slots**: `panelActions`, `modalFooter`, `columnActions`, `titleAction`, `headerExtra`, `toolbarExtra`, `toolbarAction`.
- **Icons**: `<lucide-icon [img]="SearchIcon" class="h-4 w-4" />`. The host is `display: contents`, so put
  conditional classes in a single `[class]` binding rather than `[class.foo]`.

## Backend

All data is mock data in `src/app/core/data/`. To connect real APIs, replace the seed data in `WorkspaceService` and `CaseService` (`src/app/core/services/`) with HTTP calls; components read state only through these services.
