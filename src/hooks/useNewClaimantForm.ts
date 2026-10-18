import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { underwriters } from '../data/underwriters';
import { BrokerRow, CaseStatus, EmailMessage, Gender, InboxItem } from '../types/workspace';
import { ageParts, formatUSDate, parseUSDate } from '../utils/date';

export type AttachMedical = 'email' | 'attachments' | 'both' | 'none';

export interface ClaimantFormValues {
  prefix: string;
  first: string;
  middle: string;
  last: string;
  aka: string;
  dob: string;
  gender: Gender | '';
  rush: boolean;
  rework: boolean;
  mediation: boolean;
  msa: boolean;
  wc: boolean;
  status: CaseStatus;
  underwriter: string;
  attachMedical: AttachMedical;
  brokers: BrokerRow[];
}

export type ClaimantFormErrors = Partial<Record<'first' | 'last' | 'dob' | 'gender' | 'underwriter', string>>;

export function useNewClaimantForm(item: InboxItem | undefined, email: EmailMessage | undefined) {
  const navigate = useNavigate();
  const { addToQueue } = useWorkspace();
  const [values, setValues] = useState<ClaimantFormValues>(() => ({
    prefix: '',
    first: email?.prefill?.first ?? '',
    middle: email?.prefill?.middle ?? '',
    last: email?.prefill?.last ?? '',
    aka: '',
    dob: email?.prefill?.dob ?? '',
    gender: email?.prefill?.gender ?? '',
    rush: false,
    rework: false,
    mediation: false,
    msa: false,
    wc: false,
    status: 'Ready for UW',
    underwriter: underwriters[0],
    attachMedical: 'both',
    brokers: email?.broker ? [email.broker] : []
  }));
  const [errors, setErrors] = useState<ClaimantFormErrors>({});
  const [saving, setSaving] = useState<'close' | 'open' | null>(null);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const dobDate = parseUSDate(values.dob);
  const age = dobDate ? ageParts(dobDate) : null;

  const set = <K extends keyof ClaimantFormValues,>(key: K, value: ClaimantFormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => key in e ? { ...e, [key]: undefined } : e);
  };

  const removeBroker = (id: string) => set('brokers', values.brokers.filter((b) => b.id !== id));

  const validate = (): ClaimantFormErrors => {
    const next: ClaimantFormErrors = {};
    if (!values.first.trim()) next.first = 'Enter the claimant’s first name.';
    if (!values.last.trim()) next.last = 'Enter the claimant’s last name.';
    if (!values.dob.trim()) next.dob = 'Enter the date of birth.';else
    if (!dobDate) next.dob = 'Use the format MM/DD/YYYY.';
    if (!values.gender) next.gender = 'Select a gender.';
    if (!values.underwriter) next.underwriter = 'Assign an underwriter.';
    return next;
  };

  const submit = (mode: 'close' | 'open') => {
    if (!item || saving) return;
    const next = validate();
    const keys = Object.keys(next);
    setErrors(next);
    if (keys.length) {
      document.getElementById(`claimant-${keys[0]}`)?.focus();
      return;
    }
    setSaving(mode);
    timer.current = window.setTimeout(() => {
      const name = `${values.first.trim()} ${values.last.trim()}`.toUpperCase();
      const created = addToQueue({
        rush: values.rush,
        rework: values.rework,
        claimant: name,
        dob: dobDate ? formatUSDate(dobDate) : values.dob,
        gender: values.gender as Gender,
        dateReceived: item.receivedOn,
        sender: `${item.fromName} (${item.fromEmail})`,
        status: values.status
      });
      setSaving(null);
      const assignee = values.underwriter.replace(/\s*\(\d+\)$/, '');
      if (mode === 'close') {
        toast.success(`${name} added to the work queue`, { description: `Case ${created.caseNumber} · Assigned to ${assignee}` });
        navigate('/', { state: { highlight: created.id } });
      } else {
        toast.success(`Case ${created.caseNumber} created`, { description: `Assigned to ${assignee}` });
        navigate(`/case/${created.caseNumber}`);
      }
    }, 700);
  };

  return { values, set, errors, age, saving, submit, removeBroker };
}