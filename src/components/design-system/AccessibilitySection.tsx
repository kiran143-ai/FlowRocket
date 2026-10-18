import React from 'react';
import { TriangleAlertIcon } from 'lucide-react';
import { a11yGuidelines, flaggedChanges } from '../../data/designTokens';
import { DocSection } from './DocSection';

export function AccessibilitySection() {
  return (
    <>
      <DocSection id="accessibility" title="Accessibility — WCAG 2.2 AA" description="Every component on this page and every screen in the prototype meets these criteria.">
        <div className="overflow-x-auto rounded-lg border border-ink-200 bg-white">
          <table className="w-full min-w-[640px] text-[13px]">
            <thead className="bg-ink-50 text-left text-xs font-semibold text-ink-700">
              <tr>
                <th scope="col" className="w-64 px-4 py-2.5">Success criterion</th>
                <th scope="col" className="px-4 py-2.5">How FlowRocket meets it</th>
              </tr>
            </thead>
            <tbody>
              {a11yGuidelines.map((g) =>
              <tr key={g.criterion} className="border-t border-ink-100 align-top">
                  <th scope="row" className="px-4 py-3 text-left font-semibold text-ink-900">{g.criterion}</th>
                  <td className="px-4 py-3 leading-5 text-ink-700">{g.guidance}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection id="review" title="Flagged for review" description="Where the redesign had to go beyond visual refinement, the original structure was kept and the change is listed here for client sign-off.">
        <ol className="divide-y divide-ink-100 rounded-lg border border-warning-100 bg-white">
          {flaggedChanges.map((f, i) =>
          <li key={f.title} className="flex gap-3 px-4 py-3">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-warning-50 text-xs font-semibold text-warning-700">{i + 1}</span>
              <div>
                <p className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-900">
                  <TriangleAlertIcon className="h-3.5 w-3.5 text-warning-600" aria-hidden="true" />
                  {f.title}
                </p>
                <p className="mt-0.5 text-[13px] leading-5 text-ink-700">{f.detail}</p>
              </div>
            </li>
          )}
        </ol>
      </DocSection>
    </>);

}