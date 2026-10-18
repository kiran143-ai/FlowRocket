import { CaseRecord } from '../types/case';

export const raFileName = (c: CaseRecord) => c.raSheet?.fileName ?? `${c.caseNumber}-${c.broker.cityCode}-RASheet.pdf`;

export const raSubject = (c: CaseRecord) => `NYL RA for ${c.claimantName} Case # ${c.caseNumber}`;

export type CaseStage = 'received' | 'rated' | 'sheet' | 'communicated';

export const CASE_STAGES: {id: CaseStage;label: string;}[] = [
{ id: 'received', label: 'Received for UW' },
{ id: 'rated', label: 'Rated' },
{ id: 'sheet', label: 'RA sheet ready' },
{ id: 'communicated', label: 'Sent to broker' }];


export function caseStage(c: CaseRecord): CaseStage {
  if (c.status === 'CS Communicated') return 'communicated';
  if (c.rating) return 'sheet';
  return 'received';
}
