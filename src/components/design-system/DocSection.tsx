import React from 'react';

interface DocSectionProps {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function DocSection({ id, title, description, children }: DocSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 border-t border-ink-200 pt-8 first:border-t-0 first:pt-0">
      <h2 id={`${id}-title`} className="text-lg font-semibold text-ink-900">
        {title}
      </h2>
      {description && <p className="mt-1 max-w-3xl text-sm text-ink-500">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>);

}

export function DemoLabel({ children }: {children: React.ReactNode;}) {
  return <p className="mb-2 text-xs font-medium text-ink-500">{children}</p>;
}