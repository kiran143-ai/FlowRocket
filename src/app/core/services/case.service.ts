import { computed, inject, Injectable, Signal } from '@angular/core';
import { cases } from '../data/cases';
import { CaseRecord } from '../types/case';
import { ageParts, parseUSDate } from '../utils/date';
import { initialsOf } from '../utils/email';
import { WorkspaceService } from './workspace.service';

/** Builds full case records from seed data plus the workspace's live queue, ratings and statuses. */
@Injectable({ providedIn: 'root' })
export class CaseService {
  private readonly ws = inject(WorkspaceService);

  /** Every case the workspace knows about — queue cases first, then earlier communicated ones. */
  readonly all = computed(() => {
    const ids = [...this.ws.queue().map((q) => q.caseNumber), ...cases.map((c) => c.caseNumber)];
    return [...new Set(ids)].map((id) => this.build(id)).filter((c): c is CaseRecord => !!c);
  });

  /** Reactive lookup for a route param signal. */
  byId(caseId: Signal<string | undefined>): Signal<CaseRecord | undefined> {
    return computed(() => {
      const id = caseId();
      return id ? this.build(id) : undefined;
    });
  }

  private build(caseId: string): CaseRecord | undefined {
    let base = cases.find((c) => c.caseNumber === caseId);

    if (!base) {
      const item = this.ws.queue().find((q) => q.caseNumber === caseId);
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

    const ratings = this.ws.ratings();
    const rating = caseId in ratings ? ratings[caseId] : base.rating;
    const status = this.ws.statuses()[caseId] ?? base.status;
    return { ...base, rating, status };
  }
}
