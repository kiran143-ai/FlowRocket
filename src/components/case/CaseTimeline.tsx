import React from "react";
import { FileTextIcon, FlagIcon, SendIcon, StickyNoteIcon, type LucideIcon } from "lucide-react";
import { TimelineEvent } from "../../types/case";
const kinds: Record<TimelineEvent['kind'], {
  icon: LucideIcon;
  cls: string;
}> = {
  note: {
    icon: StickyNoteIcon,
    cls: 'text-brand-600'
  },
  document: {
    icon: FileTextIcon,
    cls: 'text-danger-600'
  },
  rated: {
    icon: FlagIcon,
    cls: 'text-warning-600'
  },
  requested: {
    icon: FlagIcon,
    cls: 'text-ink-500'
  },
  sent: {
    icon: SendIcon,
    cls: 'text-ink-500'
  }
};
interface CaseTimelineProps {
  events: TimelineEvent[];
  onOpenLink: (event: TimelineEvent) => void;
}
export function CaseTimeline({
  events,
  onOpenLink
}: CaseTimelineProps) {
  if (!events.length) return <p className="py-6 text-center text-[13px] text-ink-500">No Records Found</p>;
  return <ol className="relative space-y-5 before:absolute before:bottom-3 before:left-[15px] before:top-3 before:w-px before:bg-ink-200">
      {events.map((event) => {
      const {
        icon: Icon,
        cls
      } = kinds[event.kind];
      return <li key={event.id} className="relative flex gap-3">
            <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink-200 bg-white">
              <Icon className={`h-4 w-4 ${cls}`} aria-hidden="true" />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-[13px] font-semibold text-ink-900">{event.title}</p>
              {event.link && <button type="button" onClick={() => onOpenLink(event)} className="link break-words text-left text-[13px]">
                  {event.link}
                </button>}
              <p className="mt-0.5 text-xs text-ink-500">
                by {event.by} on {event.on}
              </p>
            </div>
          </li>;
    })}
    </ol>;
}