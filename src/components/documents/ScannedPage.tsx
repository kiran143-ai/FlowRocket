import React from 'react';

const widths = ['100%', '94%', '97%', '88%', '100%', '72%', '0', '100%', '91%', '96%', '84%', '0', '100%', '93%', '60%'];

export function ScannedPage({ title, page }: {title: string;page: number;}) {
  return (
    <div className="min-h-[1056px] px-16 py-14 font-serif text-[13px] text-black">
      <div className="flex justify-between text-xs">
        <span>{title.toUpperCase()}</span>
        <span>Page {page}</span>
      </div>
      <div className="mt-10 space-y-3" aria-hidden="true">
        {[0, 1, 2].map((block) =>
        <div key={block} className="space-y-2.5 pb-6">
            {widths.map((w, i) =>
          <span key={i} className="block h-2 rounded-sm bg-ink-200" style={{ width: w }} />
          )}
          </div>
        )}
      </div>
      <p className="sr-only">Scanned page {page} of {title}.</p>
    </div>);

}