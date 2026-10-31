import { ClipboardPenIcon, EyeIcon, LucideIconData, SendIcon } from 'lucide-angular';
import { CaseRecord } from '../core/types/case';
import { caseStage } from '../core/utils/raSheet';

export interface NextStep {
  title: string;
  body: string;
  cta: string;
  icon: LucideIconData;
  to: string;
  done: boolean;
}

/** What the underwriter should do next on a case, shared by every view of the case workflow. */
export function caseNextStep(c: CaseRecord): NextStep {
  const base = `/case/${c.caseNumber}`;
  switch (caseStage(c)) {
    case 'received':
      return { title: 'Next: rate this case', body: 'Use the life expectancy table to calculate the rated age.', cta: 'Rate case', icon: ClipboardPenIcon, to: `${base}/rating/edit`, done: false };
    case 'communicated':
      return { title: 'All done', body: `RA confirmation was sent to ${c.broker.firm}.`, cta: 'View RA sheet', icon: EyeIcon, to: `${base}/ra-sheet`, done: true };
    default:
      return { title: 'Next: send the RA to the broker', body: `Email the confirmation sheet to ${c.broker.contact}.`, cta: 'Send to broker', icon: SendIcon, to: `${base}/message`, done: false };
  }
}
