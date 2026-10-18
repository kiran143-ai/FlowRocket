import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { WorkspaceProvider } from './contexts/WorkspaceContext';
import { AppShell } from './components/layout/AppShell';
import { ActivitySheet } from './pages/ActivitySheet';
import { AddMessage } from './pages/AddMessage';
import { Dashboard } from './pages/Dashboard';
import { DesignSystem } from './pages/DesignSystem';
import { DocumentView } from './pages/DocumentView';
import { EmailReview } from './pages/EmailReview';
import { NewClaimant } from './pages/NewClaimant';
import { RASheet } from './pages/RASheet';
import { RatingEdit } from './pages/RatingEdit';
import { RatingView } from './pages/RatingView';
import { ReplyToBroker } from './pages/ReplyToBroker';
import { Reports } from './pages/Reports';

export function App() {
  return (
    <BrowserRouter>
      <WorkspaceProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/email/:emailId" element={<EmailReview />} />
            <Route path="/email/:emailId/new-claimant" element={<NewClaimant />} />
            <Route path="/email/:emailId/reply" element={<ReplyToBroker />} />
            <Route path="/document/:docId" element={<DocumentView />} />
            <Route path="/case/:caseId" element={<ActivitySheet />} />
            <Route path="/case/:caseId/rating" element={<RatingView />} />
            <Route path="/case/:caseId/rating/edit" element={<RatingEdit />} />
            <Route path="/case/:caseId/ra-sheet" element={<RASheet />} />
            <Route path="/case/:caseId/message" element={<AddMessage />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/design-system" element={<DesignSystem />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <Toaster position="bottom-right" richColors closeButton />
      </WorkspaceProvider>
    </BrowserRouter>);

}