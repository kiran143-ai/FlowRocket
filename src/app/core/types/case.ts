import { CaseStatus, Gender } from './workspace';

export interface RatingValues {
  dateEvaluated: string;
  multMethod: string;
  mult: number;
  age: number;
  normalLE: number;
  normalLE75: number;
  estimatedLE: number;
  calculatedRatedAge: number;
  finalRatedAge: number;
  responseDate: string;
  expirationDate: string;
  underwriter: string;
  primaryImpairmentCode: string;
  secondaryImpairmentCodes: string[];
  note: string[];
}

export interface TimelineEvent {
  id: string;
  kind: 'note' | 'document' | 'rated' | 'requested' | 'sent';
  title: string;
  link?: string;
  by: string;
  on: string;
}

export interface WallEntry {
  id: string;
  kind: 'email' | 'note';
  label: string;
  at: string;
  subject: string;
  by: string;
}

export interface PersonContact {
  name: string;
  initials: string;
  role: string;
  email: string;
  phone: string;
  address: string;
}

export interface CaseRecord {
  caseNumber: string;
  claimantName: string;
  initials: string;
  dob: string;
  gender: Gender;
  ageNow: string;
  createdBy: string;
  createdOn: string;
  status: CaseStatus;
  flags: {rush: boolean;rework: boolean;mediation: boolean;msa: boolean;wc: boolean;};
  underwriter: PersonContact;
  broker: {firm: string;city: string;cityCode: string;contact: string;email: string;};
  rating: RatingValues | null;
  raSheet: {fileName: string;comment: string;createdBy: string;createdOn: string;} | null;
  timeline: TimelineEvent[];
  wall: WallEntry[];
}