import React from 'react';
import { Badge, BadgeTone } from '../ui/Badge';
import { CaseStatus } from '../../types/workspace';

const tones: Record<CaseStatus, BadgeTone> = {
  'Ready for UW': 'info',
  'Rated*': 'warning',
  'CS Communicated': 'success'
};

export function StatusBadge({ status }: {status: CaseStatus;}) {
  return (
    <Badge tone={tones[status]} dot>
      {status}
    </Badge>);

}