import { Routes } from '@angular/router';
import { AppShell } from './layout/app-shell';

/** Same URLs as the React prototype. Each page is lazy-loaded; route params bind to component inputs. */
export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      { path: '', title: 'Home Workspace · FlowRocket', loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard) },
      { path: 'reports', title: 'Reports · FlowRocket', loadComponent: () => import('./pages/reports/reports').then((m) => m.Reports) },
      { path: 'email/:emailId', title: 'Email Review · FlowRocket', loadComponent: () => import('./pages/email/email-review').then((m) => m.EmailReview) },
      { path: 'email/:emailId/new-claimant', title: 'New Claimant · FlowRocket', loadComponent: () => import('./pages/email/new-claimant').then((m) => m.NewClaimant) },
      { path: 'email/:emailId/reply', title: 'Reply · FlowRocket', loadComponent: () => import('./pages/email/reply-to-broker').then((m) => m.ReplyToBroker) },
      { path: 'document/:docId', title: 'Document · FlowRocket', loadComponent: () => import('./pages/email/document-view').then((m) => m.DocumentView) },
      { path: 'case/:caseId', title: 'Activity Sheets · FlowRocket', loadComponent: () => import('./pages/case/activity-sheet').then((m) => m.ActivitySheet) },
      { path: 'case/:caseId/rating', title: 'Rating Activity · FlowRocket', loadComponent: () => import('./pages/case/rating-view').then((m) => m.RatingView) },
      { path: 'case/:caseId/rating/edit', title: 'Edit Rating · FlowRocket', loadComponent: () => import('./pages/case/rating-edit').then((m) => m.RatingEdit) },
      { path: 'case/:caseId/ra-sheet', title: 'RA Confirmation Sheet · FlowRocket', loadComponent: () => import('./pages/case/ra-sheet').then((m) => m.RaSheet) },
      { path: 'case/:caseId/message', title: 'Message · FlowRocket', loadComponent: () => import('./pages/case/add-message').then((m) => m.AddMessage) },
      { path: 'design-system', title: 'Design System · FlowRocket', loadComponent: () => import('./pages/design-system/design-system').then((m) => m.DesignSystem) },
      { path: '**', redirectTo: '' }
    ]
  }
];
