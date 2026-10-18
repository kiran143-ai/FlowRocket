import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { inboxItems } from '../data/inbox';
import { workQueue } from '../data/workQueue';
import { RatingValues } from '../types/case';
import { CaseStatus, InboxItem, NewQueueItem, QueueItem } from '../types/workspace';

interface WorkspaceValue {
  queue: QueueItem[];
  inbox: InboxItem[];
  ratings: Record<string, RatingValues | null>;
  statuses: Record<string, CaseStatus>;
  addToQueue: (item: NewQueueItem) => QueueItem;
  trashInbox: (id: string) => void;
  restoreInbox: (item: InboxItem, index: number) => void;
  markReplied: (id: string) => void;
  saveRating: (caseNumber: string, rating: RatingValues | null) => void;
  setCaseStatus: (caseNumber: string, status: CaseStatus) => void;
}

const WorkspaceContext = createContext<WorkspaceValue | null>(null);

export function WorkspaceProvider({ children }: {children: React.ReactNode;}) {
  const [queue, setQueue] = useState<QueueItem[]>(workQueue);
  const [inbox, setInbox] = useState<InboxItem[]>(inboxItems);
  const [ratings, setRatings] = useState<Record<string, RatingValues | null>>({});
  const [statuses, setStatuses] = useState<Record<string, CaseStatus>>({});
  const nextCase = useRef(1868);

  const addToQueue = useCallback((input: NewQueueItem) => {
    const caseNumber = `26-0${nextCase.current}`;
    nextCase.current += 1;
    const item: QueueItem = { ...input, id: `q-${caseNumber}`, caseNumber };
    setQueue((q) => [item, ...q]);
    return item;
  }, []);

  const trashInbox = useCallback((id: string) => setInbox((list) => list.filter((i) => i.id !== id)), []);

  const restoreInbox = useCallback((item: InboxItem, index: number) => {
    setInbox((list) => {
      const next = [...list];
      next.splice(Math.min(Math.max(index, 0), next.length), 0, item);
      return next;
    });
  }, []);

  const markReplied = useCallback(
    (id: string) => setInbox((list) => list.map((i) => i.id === id ? { ...i, replied: true } : i)),
    []
  );

  const saveRating = useCallback(
    (caseNumber: string, rating: RatingValues | null) => setRatings((r) => ({ ...r, [caseNumber]: rating })),
    []
  );

  const setCaseStatus = useCallback((caseNumber: string, status: CaseStatus) => {
    setStatuses((s) => ({ ...s, [caseNumber]: status }));
    setQueue((q) => q.map((i) => i.caseNumber === caseNumber ? { ...i, status } : i));
  }, []);

  const value = useMemo(
    () => ({ queue, inbox, ratings, statuses, addToQueue, trashInbox, restoreInbox, markReplied, saveRating, setCaseStatus }),
    [queue, inbox, ratings, statuses, addToQueue, trashInbox, restoreInbox, markReplied, saveRating, setCaseStatus]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return ctx;
}