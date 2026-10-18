import React from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FileXIcon } from 'lucide-react';
import { Form461Page } from '../components/documents/Form461Page';
import { PdfViewer } from '../components/documents/PdfViewer';
import { ScannedPage } from '../components/documents/ScannedPage';
import { EmptyState } from '../components/layout/EmptyState';
import { getAttachment } from '../utils/email';

export function DocumentView() {
  const { docId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const found = getAttachment(docId);
  const from = params.get('from') ?? found?.email.inboxId;

  if (!found) {
    return <EmptyState icon={<FileXIcon />} title="Document not found" action={<Link to="/" className="link text-sm">Back to Home Workspace</Link>} />;
  }

  const { attachment, email } = found;
  const isForm461 = email.claimantLine === 'Jon Eldridge';

  return (
    <>
      <h1 className="sr-only">View Documents — {attachment.title}</h1>
      <PdfViewer
        fileName={`${attachment.title} · ${attachment.name}`}
        pageCount={5}
        backLabel="Back to email"
        onBack={() => navigate(from ? `/email/${from}` : '/')}
        renderPage={(p) => p === 1 && isForm461 ? <Form461Page /> : <ScannedPage title={attachment.title} page={p} />} />
      
    </>);

}