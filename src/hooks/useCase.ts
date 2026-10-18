import { useMemo } from 'react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { cases } from '../data/cases';
import { CaseRecord, RatingValues } from '../types/case';
import { CaseStatus, QueueItem } from '../types/workspace';
import { ageParts, parseUSDate } from '../utils/date';
import { initialsOf } from '../utils/email';

interface CaseSources {
  queue: QueueItem[];
  ratings: Record<string, RatingValues | null>;
  statuses: Record<string, CaseStatus>;
}

export function buildCase(caseId: string, { queue, ratings, statuses }: CaseSources): CaseRecord | undefined {
  let base = cases.find((c) => c.caseNumber === caseId);

  if (!base) {
    const item = queue.find((q) => q.caseNumber === caseId);
    if (!item) return undefined;
    const template = cases[0];
    const name = item.claimant.replace(/\s*\(\d+\)\s*$/, '');
    const dob = parseUSDate(item.dob);
    const parts = dob ? ageParts(dob) : null;
    base = {
      ...template,
      caseNumber: item.caseNumber,
      claimantName: name,
      initials: initialsOf(name),
      dob: item.dob,
      gender: item.gender ?? 'Female',
      ageNow: parts ? `${parts.years} years, ${parts.months} months` : '—',
      createdBy: 'Lauren McKenna',
      createdOn: item.dateReceived.split(' ')[0],
      status: item.status,
      flags: { ...template.flags, rush: item.rush, rework: item.rework, wc: false },
      rating: null,
      raSheet: null,
      timeline: [],
      wall: []
    };
  }

  const rating = caseId in ratings ? ratings[caseId] : base.rating;
  const status = statuses[caseId] ?? base.status;
  return { ...base, rating, status };
}

export function useCase(caseId: string | undefined): CaseRecord | undefined {
  const { queue, ratings, statuses } = useWorkspace();
  return useMemo(() => caseId ? buildCase(caseId, { queue, ratings, statuses }) : undefined, [caseId, queue, ratings, statuses]);
}

/** Every case the workspace knows about — queue cases first, then earlier communicated ones. */
export function useAllCases(): CaseRecord[] {
  const { queue, ratings, statuses } = useWorkspace();
  return useMemo(() => {
    const ids = [...queue.map((q) => q.caseNumber), ...cases.map((c) => c.caseNumber)];
    return [...new Set(ids)].map((id) => buildCase(id, { queue, ratings, statuses })).filter((c): c is CaseRecord => !!c);
  }, [queue, ratings, statuses]);
}
