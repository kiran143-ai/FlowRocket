import React from 'react';
import { AccessibilitySection } from '../components/design-system/AccessibilitySection';
import { ControlsSection } from '../components/design-system/ControlsSection';
import { DisplaySection } from '../components/design-system/DisplaySection';
import { FoundationsSection } from '../components/design-system/FoundationsSection';
import { NavigationSection } from '../components/design-system/NavigationSection';

const toc: {group: string;items: [string, string][];}[] = [
{ group: 'Foundations', items: [['color', 'Color'], ['typography', 'Typography'], ['spacing', 'Spacing & elevation'], ['layout', 'Layout & grid']] },
{ group: 'Controls', items: [['buttons', 'Buttons'], ['inputs', 'Inputs'], ['dropdowns', 'Dropdowns & choices']] },
{ group: 'Display', items: [['tables', 'Data tables'], ['badges', 'Badges & status'], ['alerts', 'Alerts & feedback'], ['cards', 'Cards, panels & tabs'], ['modals', 'Modals'], ['navigation', 'Navigation']] },
{ group: 'Guidance', items: [['accessibility', 'Accessibility'], ['review', 'Flagged for review']] }];


export function DesignSystem() {
  return (
    <div className="mx-auto grid w-full max-w-[1600px] gap-8 p-4 lg:grid-cols-[200px_minmax(0,1fr)] lg:p-6">
      <nav aria-label="Design system sections" className="hidden lg:block">
        <div className="sticky top-[112px] space-y-5">
          {toc.map((g) =>
          <div key={g.group}>
              <p className="px-2 text-xs font-semibold text-ink-500">{g.group}</p>
              <ul className="mt-1.5 space-y-0.5">
                {g.items.map(([id, label]) =>
              <li key={id}>
                    <a href={`#${id}`} className="focus-ring block rounded-md px-2 py-1 text-[13px] text-ink-700 transition-colors duration-150 hover:bg-white hover:text-ink-900">
                      {label}
                    </a>
                  </li>
              )}
              </ul>
            </div>
          )}
        </div>
      </nav>
      <div className="min-w-0">
        <header className="mb-8 rounded-lg border border-ink-200 bg-white p-6 shadow-xs">
          <h1 className="text-2xl font-semibold text-ink-900">FlowRocket Design System</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-700">
            The tokens and components behind the redesigned FlowRocket medical underwriting screens. Everything here is the same code the prototype uses, so the
            Work Queue, Email &amp; Document Review, Claimant, Rating Activity and Activity Sheets screens stay consistent with this reference.
          </p>
        </header>
        <div className="space-y-10">
          <FoundationsSection />
          <ControlsSection />
          <DisplaySection />
          <NavigationSection />
          <AccessibilitySection />
        </div>
      </div>
    </div>);

}