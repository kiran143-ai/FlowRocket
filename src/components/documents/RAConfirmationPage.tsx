import React from 'react';
import { CaseRecord } from '../../types/case';
import { raFileName } from '../../utils/raSheet';
import { raSheetContent } from '../../utils/raSheetPdf';

function InfoCard({ title, rows }: {title: string;rows: [string, string][];}) {
  return (
    <section className="rounded-lg border border-ink-200 p-5">
      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-600">{title}</h3>
      <dl className="mt-3 grid grid-cols-[110px_1fr] gap-y-2 text-[13px]">
        {rows.map(([k, v]) =>
        <React.Fragment key={k}>
            <dt className="text-ink-500">{k}</dt>
            <dd className="font-semibold text-ink-900">{v}</dd>
          </React.Fragment>
        )}
      </dl>
    </section>);

}

/** Letter-size (816 × 1056 px) preview; utils/raSheetPdf.ts draws the same layout for download. */
export function RAConfirmationPage({ caseRecord: c }: {caseRecord: CaseRecord;}) {
  const r = c.rating;
  const content = raSheetContent(c);

  return (
    <div className="flex min-h-[1056px] flex-col text-ink-900">
      <header className="flex items-center gap-5 bg-brand-800 px-16 py-8 text-white">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded bg-white text-center text-[11px] font-bold leading-tight text-brand-800">
          NEW
          <br />
          YORK
          <br />
          LIFE
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-2xl font-bold">Rated Age Confirmation</p>
          <p className="mt-1 text-[13px] text-brand-200">New York Life Insurance Company · Structured Settlements Medical Underwriting</p>
        </div>
        <div className="text-right">
          <p className="text-[13px] font-bold">Case # {c.caseNumber}</p>
          {r && <p className="mt-1 text-xs text-brand-200">Issued {r.responseDate}</p>}
        </div>
      </header>

      <div className="flex-1 space-y-8 px-16 py-9">
        {r ?
        <section aria-label="Rated age" className="flex items-center gap-8 rounded-lg border border-brand-200 bg-brand-50 px-7 py-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-500">Final rated age</p>
              <p className="mt-1 text-6xl font-bold tabular-nums text-danger-600">{r.finalRatedAge}</p>
            </div>
            <span className="h-20 w-px bg-brand-200" aria-hidden="true" />
            <dl className="grid flex-1 grid-cols-4 gap-4">
              {[
            ['Actual age', String(r.age)],
            ['Years rated up', `+${r.finalRatedAge - r.age}`],
            ['Normal L.E.', `${r.normalLE.toFixed(2)} yrs`],
            ['Estimated L.E.', `${r.estimatedLE.toFixed(2)} yrs`]].
            map(([k, v]) =>
            <div key={k}>
                  <dt className="text-xs text-ink-500">{k}</dt>
                  <dd className="mt-1 text-xl font-bold tabular-nums">{v}</dd>
                </div>
            )}
            </dl>
          </section> :

        <p className="rounded-lg border border-dashed border-ink-300 p-6 text-center text-sm text-ink-500">This case hasn’t been rated yet.</p>
        }

        <div className="grid grid-cols-2 gap-4">
          <InfoCard title="Claimant" rows={content.claimant} />
          <InfoCard title="Broker" rows={content.broker} />
        </div>

        {r &&
        <>
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-600">Rating details</h3>
              <dl className="mt-3 border-b border-ink-200 text-[13px]">
                {content.details.map(([k, v]) =>
              <div key={k} className="flex justify-between px-3 py-2 odd:bg-ink-50">
                    <dt className="text-ink-500">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
              )}
              </dl>
            </section>
            <p className="rounded-md bg-warning-50 px-4 py-3 text-[13px] text-warning-700">
              <span className="font-semibold">This rated age is valid through {r.expirationDate}.</span>
              <br />
              After this date, request a new rating with updated medical records.
            </p>
          </>
        }

        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-500">Underwriter</h3>
          <p className="mt-1.5 text-lg font-bold">{c.underwriter.name}</p>
          <p className="text-[13px] text-ink-500">
            {c.underwriter.email} · {c.underwriter.phone}
          </p>
        </section>
      </div>

      <footer className="mx-16 flex justify-between gap-4 border-t border-ink-200 py-4 text-[11px] text-ink-500">
        <span>Confidential — contains protected health information intended only for the named broker.</span>
        <span className="shrink-0">{raFileName(c)} · Page 1 of 1</span>
      </footer>
    </div>);

}
