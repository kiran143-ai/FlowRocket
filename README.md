# FlowRocket

Redesign prototype for FlowRocket, the structured settlements medical underwriting workspace: work queue, broker email triage, claimant intake, rated-age calculation, RA Confirmation Sheet (PDF) and broker communication.

This repository holds two implementations of the same prototype:

| Folder | Stack | Status |
|---|---|---|
| [`angular-app/`](angular-app/) | Angular 21, standalone components, signals, Tailwind CSS | **Current version — start here** |
| `src/` (repo root) | React 18, Vite, Tailwind CSS | Original prototype, kept for reference |

## Angular app

```bash
cd angular-app
npm install
npm start          # http://localhost:4200
npm run build      # production build → angular-app/dist
```

Requires Node.js 20.19+, 22.12+ or 24+. See [`angular-app/README.md`](angular-app/README.md) for the folder structure and conventions.

## React app (reference)

```bash
npm install
npm run dev        # http://localhost:5173
```

## Notes

- All data is mock data in `angular-app/src/app/core/data/` (and `src/data/` for React). There is no backend yet; connect real APIs in the services under `angular-app/src/app/core/services/`.
- The design system — tokens, typography (Inter) and every UI component — is documented live at `/design-system` in the running app.
