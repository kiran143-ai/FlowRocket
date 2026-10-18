import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MailIcon, MailXIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { ClaimantSearch } from '../components/email/ClaimantSearch';
import { EmailViewer } from '../components/email/EmailViewer';
import { EmptyState } from '../components/layout/EmptyState';
import { WindowBar } from '../components/layout/WindowBar';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { getEmail } from '../utils/email';

export function EmailReview() {
  const { emailId } = useParams();
  const navigate = useNavigate();
  const { inbox, trashInbox, restoreInbox } = useWorkspace();
  const [confirmTrash, setConfirmTrash] = useState(false);
  const index = inbox.findIndex((i) => i.id === emailId);
  const item = inbox[index];

  if (!item) {
    return (
      <EmptyState
        icon={<MailXIcon />}
        title="This email is no longer in the inbox"
        description="It may have been moved to trash."
        action={
        <Link to="/" className="link text-sm">
            Back to Home Workspace
          </Link>
        } />);


  }

  const email = getEmail(item);

  const onTrash = () => {
    trashInbox(item.id);
    setConfirmTrash(false);
    toast('Email moved to trash', { description: item.subject, action: { label: 'Undo', onClick: () => restoreInbox(item, index) } });
    navigate('/');
  };

  return (
    <div className="flex min-h-[calc(100vh-88px)] flex-col">
      <WindowBar title={item.subject} icon={<MailIcon />} />
      <h1 className="sr-only">Email & Document Review — {item.subject}</h1>
      <div className="grid flex-1 bg-white lg:grid-cols-[minmax(340px,400px)_minmax(0,1fr)]">
        <aside aria-label="Claimant search" className="border-b border-ink-200 lg:border-b-0 lg:border-r">
          <ClaimantSearch onNewClaimant={() => navigate(`/email/${item.id}/new-claimant`)} onOpenClaimant={(c) => navigate(`/case/${c.caseNumber}`)} />
        </aside>
        <div className="min-w-0">
          <EmailViewer
            inbox={item}
            email={email}
            hasPrevious={index > 0}
            hasNext={index < inbox.length - 1}
            onPrevious={() => navigate(`/email/${inbox[index - 1].id}`)}
            onNext={() => navigate(`/email/${inbox[index + 1].id}`)}
            onReply={(mode) => navigate(`/email/${item.id}/reply?mode=${mode}`)}
            onTrash={() => setConfirmTrash(true)}
            onOpenAttachment={(a) => navigate(`/document/${a.id}?from=${item.id}`)} />
          
        </div>
      </div>
      <Modal
        open={confirmTrash}
        onClose={() => setConfirmTrash(false)}
        title="Move this email to trash?"
        description={`“${item.subject}” from ${item.fromName} will be removed from the SS Medicals Inbox.`}
        footer={
        <>
            <Button onClick={() => setConfirmTrash(false)}>Cancel</Button>
            <Button variant="primary" className="bg-danger-600 hover:bg-danger-700" leadingIcon={<Trash2Icon />} onClick={onTrash}>
              Move to Trash
            </Button>
          </>
        } />
      
    </div>);

}