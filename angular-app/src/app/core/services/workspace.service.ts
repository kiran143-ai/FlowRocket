import { Injectable, signal } from '@angular/core';
import { inboxItems } from '../data/inbox';
import { workQueue } from '../data/workQueue';
import { RatingValues } from '../types/case';
import { CaseStatus, InboxItem, NewQueueItem, QueueItem } from '../types/workspace';

/** App-wide workspace state: work queue, inbox, and per-case rating/status overrides. */
@Injectable({ providedIn: 'root' })
export class WorkspaceService {
  readonly queue = signal<QueueItem[]>(workQueue);
  readonly inbox = signal<InboxItem[]>(inboxItems);
  readonly ratings = signal<Record<string, RatingValues | null>>({});
  readonly statuses = signal<Record<string, CaseStatus>>({});
  private nextCase = 1868;

  addToQueue(input: NewQueueItem): QueueItem {
    const caseNumber = `26-0${this.nextCase++}`;
    const item: QueueItem = { ...input, id: `q-${caseNumber}`, caseNumber };
    this.queue.update((q) => [item, ...q]);
    return item;
  }

  trashInbox(id: string): void {
    this.inbox.update((list) => list.filter((i) => i.id !== id));
  }

  restoreInbox(item: InboxItem, index: number): void {
    this.inbox.update((list) => {
      const next = [...list];
      next.splice(Math.min(Math.max(index, 0), next.length), 0, item);
      return next;
    });
  }

  markReplied(id: string): void {
    this.inbox.update((list) => list.map((i) => (i.id === id ? { ...i, replied: true } : i)));
  }

  saveRating(caseNumber: string, rating: RatingValues | null): void {
    this.ratings.update((r) => ({ ...r, [caseNumber]: rating }));
  }

  setCaseStatus(caseNumber: string, status: CaseStatus): void {
    this.statuses.update((s) => ({ ...s, [caseNumber]: status }));
    this.queue.update((q) => q.map((i) => (i.caseNumber === caseNumber ? { ...i, status } : i)));
  }
}
