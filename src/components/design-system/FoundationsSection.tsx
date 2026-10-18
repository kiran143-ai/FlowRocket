import React from 'react';
import { colorGroups, spacingScale, typeScale } from '../../data/designTokens';
import { DocSection } from './DocSection';

function LayoutDiagram({ title, spec, children }: {title: string;spec: string;children: React.ReactNode;}) {
  return (
    <figure>
      <div className="h-36 rounded-md border border-ink-200 bg-canvas p-2" aria-hidden="true">
        {children}
      </div>
      <figcaption className="mt-2">
        <p className="text-[13px] font-semibold text-ink-900">{title}</p>
        <p className="text-xs text-ink-500">{spec}</p>
      </figcaption>
    </figure>);

}

const block = 'rounded-sm bg-white ring-1 ring-ink-200';

export function FoundationsSection() {
  return (
    <>
      <DocSection id="color" title="Color" description="Brand and semantic tokens are defined in tailwind.config.js. Screens never use raw palette values.">
        <div className="space-y-8">
          {colorGroups.map((g) =>
          <div key={g.name}>
              <h3 className="text-sm font-semibold text-ink-900">{g.name}</h3>
              <p className="mt-0.5 text-[13px] text-ink-500">{g.description}</p>
              <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
                {g.swatches.map((s) =>
              <li key={s.token} className="overflow-hidden rounded-md border border-ink-200 bg-white">
                    <div className="flex h-16 items-end p-2 text-xs font-semibold" style={{ backgroundColor: s.hex, color: s.onDark ? '#FFFFFF' : '#1B2733' }}>
                      Aa
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-semibold text-ink-900">{s.token}</p>
                      <p className="font-mono text-[11px] text-ink-500">{s.hex}</p>
                      <p className="mt-1 text-[11px] leading-4 text-ink-700">{s.usage}</p>
                    </div>
                  </li>
              )}
              </ul>
            </div>
          )}
        </div>
      </DocSection>

      <DocSection id="typography" title="Typography" description="Inter throughout. Sizes are tuned for dense underwriting data, with tabular figures for every date, age and life expectancy.">
        <div className="divide-y divide-ink-100 overflow-hidden rounded-lg border border-ink-200 bg-white">
          {typeScale.map((t) =>
          <div key={t.name} className="grid gap-2 px-4 py-3 md:grid-cols-[160px_180px_minmax(0,1fr)] md:items-center">
              <div>
                <p className="text-[13px] font-semibold text-ink-900">{t.name}</p>
                <p className="text-xs text-ink-500">{t.usage}</p>
              </div>
              <p className="font-mono text-xs text-ink-700">{t.spec}</p>
              <p className={`truncate text-ink-900 ${t.className}`}>{t.sample}</p>
            </div>
          )}
        </div>
      </DocSection>

      <DocSection id="spacing" title="Spacing, radius & elevation" description="A 4px base grid. Radii stay small to keep the enterprise density, and shadows are limited to one hairline level plus one overlay level.">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <ul className="space-y-2 rounded-lg border border-ink-200 bg-white p-4">
            {spacingScale.map((s) =>
            <li key={s.token} className="grid grid-cols-[48px_48px_1fr] items-center gap-3 text-[13px]">
                <span className="font-mono text-xs text-ink-700">{s.token}</span>
                <span className="text-xs tabular-nums text-ink-500">{s.px}px</span>
                <span className="flex items-center gap-3">
                  <span className="h-3 rounded-sm bg-brand-500" style={{ width: s.px * 2 }} aria-hidden="true" />
                  <span className="text-ink-700">{s.usage}</span>
                </span>
              </li>
            )}
          </ul>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
            ['rounded', '4px', 'Chips, toolbar buttons'],
            ['rounded-md', '6px', 'Inputs, buttons'],
            ['rounded-lg', '8px', 'Panels, cards'],
            ['rounded-xl', '12px', 'Dialogs']].
            map(([cls, px, use]) =>
            <div key={cls} className="text-center">
                <div className={`mx-auto h-16 w-full border border-ink-300 bg-white ${cls}`} aria-hidden="true" />
                <p className="mt-2 font-mono text-xs text-ink-900">{cls}</p>
                <p className="text-[11px] text-ink-500">
                  {px} · {use}
                </p>
              </div>
            )}
            <div className="col-span-2 rounded-lg border border-ink-200 bg-white p-3 shadow-xs">
              <p className="text-xs font-semibold text-ink-900">shadow-xs</p>
              <p className="text-[11px] text-ink-500">Panels, buttons, inputs</p>
            </div>
            <div className="col-span-2 rounded-lg border border-ink-200 bg-white p-3 shadow-overlay">
              <p className="text-xs font-semibold text-ink-900">shadow-overlay</p>
              <p className="text-[11px] text-ink-500">Dialogs, document pages</p>
            </div>
          </div>
        </div>
      </DocSection>

      <DocSection id="layout" title="Layout & grid" description="Each screen keeps its original arrangement. These are the four layouts the application uses.">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <LayoutDiagram title="Workspace (stacked panels)" spec="Max 1600px · 24px gutter · 20px gap">
            <div className="flex h-full flex-col gap-1.5">
              <div className={`h-1/4 ${block}`} />
              <div className={`h-1/4 ${block}`} />
              <div className={`h-1/4 w-1/2 ${block}`} />
              <div className={`h-1/4 ${block}`} />
            </div>
          </LayoutDiagram>
          <LayoutDiagram title="Review split pane" spec="Search 340–400px · email fills rest">
            <div className="grid h-full grid-cols-[38%_1fr] gap-1.5">
              <div className={block} />
              <div className={block} />
            </div>
          </LayoutDiagram>
          <LayoutDiagram title="Case detail" spec="Main 1fr · side 400px at ≥1280px">
            <div className="flex h-full flex-col gap-1.5">
              <div className={`h-4 ${block}`} />
              <div className="grid flex-1 grid-cols-[1fr_36%] gap-1.5">
                <div className={block} />
                <div className={block} />
              </div>
            </div>
          </LayoutDiagram>
          <LayoutDiagram title="Activity Sheets" spec="3 columns ≥1280px · 2 at ≥1024px · stacked below">
            <div className="flex h-full flex-col gap-1.5">
              <div className={`h-4 ${block}`} />
              <div className="grid flex-1 grid-cols-3 gap-1.5">
                <div className="rounded-sm bg-white ring-1 ring-ink-200">
                  <div className="h-2 rounded-t-sm bg-success-700" />
                </div>
                <div className="rounded-sm bg-white ring-1 ring-ink-200">
                  <div className="h-2 rounded-t-sm bg-warning-500" />
                </div>
                <div className="rounded-sm bg-white ring-1 ring-ink-200">
                  <div className="h-2 rounded-t-sm bg-brand-600" />
                </div>
              </div>
            </div>
          </LayoutDiagram>
        </div>
        <p className="mt-4 text-[13px] text-ink-500">
          Breakpoints: sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536. Desktop layouts are the baseline. Below lg, panes stack in their original reading order and tables scroll horizontally instead of dropping columns.
        </p>
      </DocSection>
    </>);

}