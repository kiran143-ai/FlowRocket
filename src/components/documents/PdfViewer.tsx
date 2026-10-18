import React, { useRef, useState } from 'react';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, DownloadIcon, FileTextIcon, PanelLeftIcon, PrinterIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { IconButton } from '../ui/IconButton';

interface PdfViewerProps {
  fileName: string;
  pageCount: number;
  renderPage: (page: number) => React.ReactNode;
  onBack: () => void;
  backLabel: string;
  toolbarExtra?: React.ReactNode;
  onDownload?: () => void;
  /** Primary call to action shown at the far right of the toolbar. */
  toolbarAction?: React.ReactNode;
}

const ZOOMS = [50, 75, 100, 125, 150];
const darkBtn = 'focus-visible:ring-white focus-visible:ring-offset-ink-900';

export function PdfViewer({ fileName, pageCount, renderPage, onBack, backLabel, toolbarExtra, onDownload, toolbarAction }: PdfViewerProps) {
  const [page, setPage] = useState(1);
  const [draft, setDraft] = useState('1');
  const [zoom, setZoom] = useState(100);
  const [thumbs, setThumbs] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const goTo = (p: number) => {
    const n = Math.min(Math.max(p, 1), pageCount);
    setPage(n);
    setDraft(String(n));
    pageRefs.current[n - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onScroll = () => {
    const c = scrollRef.current;
    if (!c) return;
    const top = c.getBoundingClientRect().top;
    let best = 1;
    pageRefs.current.forEach((el, i) => {
      if (el && el.getBoundingClientRect().top - top <= 160) best = i + 1;
    });
    if (best !== page) {
      setPage(best);
      setDraft(String(best));
    }
  };

  const zoomIdx = ZOOMS.indexOf(zoom);

  return (
    <div className="flex h-[calc(100vh-88px)] flex-col">
      <div className="flex min-h-[48px] flex-wrap items-center gap-2 bg-ink-900 px-3 py-1.5 text-white">
        <button
          type="button"
          onClick={onBack}
          className={twMerge('focus-ring inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-[13px] font-medium text-white/90 transition-colors duration-150 hover:bg-white/10 hover:text-white', darkBtn)}>
          
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          {backLabel}
        </button>
        <span className="h-5 w-px bg-white/20" aria-hidden="true" />
        <IconButton label={thumbs ? 'Hide page thumbnails' : 'Show page thumbnails'} variant="onBrand" className={twMerge('hidden md:inline-flex', darkBtn)} onClick={() => setThumbs((t) => !t)}>
          <PanelLeftIcon />
        </IconButton>
        <p className="flex min-w-0 items-center gap-1.5 text-[13px] font-medium">
          <FileTextIcon className="h-4 w-4 shrink-0 text-danger-500" aria-hidden="true" />
          <span className="truncate">{fileName}</span>
        </p>

        <div className="mx-auto flex items-center gap-1">
          <IconButton label="Previous page" variant="onBrand" size="sm" className={darkBtn} disabled={page <= 1} onClick={() => goTo(page - 1)}>
            <ChevronLeftIcon />
          </IconButton>
          <label htmlFor="pdf-page" className="sr-only">
            Page number
          </label>
          <input
            id="pdf-page"
            value={draft}
            inputMode="numeric"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && goTo(Number(draft) || 1)}
            onBlur={() => goTo(Number(draft) || 1)}
            className="h-7 w-10 rounded bg-ink-800 text-center text-[13px] tabular-nums text-white ring-1 ring-white/20 focus:outline-none focus:ring-2 focus:ring-white" />
          
          <span className="text-[13px] tabular-nums text-white/80">/ {pageCount}</span>
          <IconButton label="Next page" variant="onBrand" size="sm" className={darkBtn} disabled={page >= pageCount} onClick={() => goTo(page + 1)}>
            <ChevronRightIcon />
          </IconButton>
          <span className="mx-1.5 h-5 w-px bg-white/20" aria-hidden="true" />
          <IconButton label="Zoom out" variant="onBrand" size="sm" className={darkBtn} disabled={zoomIdx <= 0} onClick={() => setZoom(ZOOMS[zoomIdx - 1])}>
            <ZoomOutIcon />
          </IconButton>
          <span className="w-12 text-center text-[13px] tabular-nums text-white/90" aria-live="polite">
            {zoom}%
          </span>
          <IconButton label="Zoom in" variant="onBrand" size="sm" className={darkBtn} disabled={zoomIdx >= ZOOMS.length - 1} onClick={() => setZoom(ZOOMS[zoomIdx + 1])}>
            <ZoomInIcon />
          </IconButton>
        </div>

        <div className="flex items-center gap-1">
          {toolbarExtra}
          <IconButton label="Download" variant="onBrand" className={darkBtn} onClick={onDownload ?? (() => toast.success(`Downloading ${fileName}`))}>
            <DownloadIcon />
          </IconButton>
          <IconButton label="Print" variant="onBrand" className={darkBtn} onClick={() => window.print()}>
            <PrinterIcon />
          </IconButton>
          {toolbarAction && <span className="ml-1">{toolbarAction}</span>}
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {thumbs &&
        <nav aria-label="Pages" className="hidden w-44 shrink-0 space-y-4 overflow-y-auto bg-ink-800 p-4 md:block">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) =>
          <button
            key={p}
            type="button"
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
            onClick={() => goTo(p)}
            className={twMerge('focus-ring block w-full rounded-md p-1.5 text-center transition-colors duration-150 focus-visible:ring-offset-ink-800', p === page ? 'bg-brand-600/40 ring-2 ring-brand-300' : 'hover:bg-white/10')}>
            
                <span className="block aspect-[8.5/11] w-full space-y-1.5 rounded-sm bg-white p-2.5" aria-hidden="true">
                  <span className="block h-1.5 w-1/2 rounded-full bg-ink-300" />
                  <span className="block h-1 w-full rounded-full bg-ink-200" />
                  <span className="block h-1 w-5/6 rounded-full bg-ink-200" />
                  <span className="block h-1 w-full rounded-full bg-ink-200" />
                  <span className="block h-1 w-2/3 rounded-full bg-ink-200" />
                </span>
                <span className="mt-1.5 block text-xs text-white/80">{p}</span>
              </button>
          )}
          </nav>
        }
        <div ref={scrollRef} onScroll={onScroll} className="min-w-0 flex-1 overflow-auto bg-ink-700 px-4 py-6">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) =>
          <div
            key={p}
            ref={(el) => {
              pageRefs.current[p - 1] = el;
            }}
            aria-label={`Page ${p} of ${pageCount}`}
            role="region"
            className="mx-auto mb-6 w-[816px] scroll-mt-6 bg-white shadow-overlay"
            style={{ zoom: zoom / 100 }}>
            
              {renderPage(p)}
            </div>
          )}
        </div>
      </div>
    </div>);

}