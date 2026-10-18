import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FileXIcon, SendIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useCase } from '../hooks/useCase';
import { PdfViewer } from '../components/documents/PdfViewer';
import { RAConfirmationPage } from '../components/documents/RAConfirmationPage';
import { EmptyState } from '../components/layout/EmptyState';
import { Button } from '../components/ui/Button';
import { raFileName } from '../utils/raSheet';
import { downloadRASheet } from '../utils/raSheetPdf';

export function RASheet() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const c = useCase(caseId);
  const [annotate, setAnnotate] = useState(false);

  if (!c) return <EmptyState icon={<FileXIcon />} title="Case not found" action={<Link to="/" className="link text-sm">Back to Home Workspace</Link>} />;

  const fileName = raFileName(c);
  const download = () => {
    if (!c.rating) return toast.error('Rate this case before downloading the RA sheet.');
    downloadRASheet(c);
    toast.success('RA sheet downloaded', { description: fileName });
  };

  return (
    <>
      <h1 className="sr-only">RA Confirmation Sheet — {fileName}</h1>
      <PdfViewer
        fileName={fileName}
        pageCount={1}
        backLabel="Back to Rating Activity"
        onBack={() => navigate(`/case/${c.caseNumber}/rating`)}
        renderPage={() => <RAConfirmationPage caseRecord={c} />}
        onDownload={download}
        toolbarExtra={
        <button
          type="button"
          role="switch"
          aria-checked={annotate}
          onClick={() => setAnnotate((a) => !a)}
          className="focus-ring mr-1 inline-flex h-8 items-center gap-2 rounded-md px-2 text-[13px] font-medium text-white/90 hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-ink-900">
          
            Annotate
            <span className={`relative h-4 w-7 rounded-full transition-colors duration-150 ${annotate ? 'bg-warning-500' : 'bg-white/30'}`} aria-hidden="true">
              <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform duration-150 ${annotate ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
            </span>
          </button>
        }
        toolbarAction={
        <Button size="sm" variant="primary" leadingIcon={<SendIcon />} disabled={!c.rating} onClick={() => navigate(`/case/${c.caseNumber}/message`)}>
            Send to broker
          </Button>
        } />
      
    </>);

}