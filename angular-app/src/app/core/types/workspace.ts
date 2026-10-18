export type CaseStatus = 'Ready for UW' | 'Rated*' | 'CS Communicated';
export type Gender = 'Male' | 'Female';
export type ReplyMode = 'reply' | 'all' | 'forward';

export interface QueueItem {
  id: string;
  rush: boolean;
  rework: boolean;
  caseNumber: string;
  claimant: string;
  dob: string;
  gender?: Gender;
  dateReceived: string;
  sender: string;
  status: CaseStatus;
}

export type NewQueueItem = Omit<QueueItem, 'id' | 'caseNumber'>;

export interface InboxItem {
  id: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  receivedOn: string;
  status: string;
  replied: boolean;
}

export interface SecondaryReviewItem {
  id: string;
  rush: boolean;
  rework: boolean;
  caseNumber: string;
  claimant: string;
  dateReceived: string;
  sender: string;
  underwriter: string;
}

export interface ReturnEmailItem {
  id: string;
  from: string;
  subject: string;
  receivedOn: string;
}

export interface Attachment {
  id: string;
  name: string;
  title: string;
}

export interface BrokerRow {
  id: string;
  name: string;
  city: string;
  contact: string;
  emailFax: string;
}

export interface ClaimantPrefill {
  first: string;
  middle?: string;
  last: string;
  dob: string;
  gender: Gender;
}

export interface EmailMessage {
  inboxId: string;
  sentAt: string;
  claimantLine: string;
  to: string;
  attachments: Attachment[];
  body: string[][];
  signature: string[];
  prefill?: ClaimantPrefill;
  broker?: BrokerRow;
}

export interface ExistingClaimant {
  id: string;
  name: string;
  dob: string;
  brokers: string;
  caseNumber: string;
}

export interface Recipients {
  from: string;
  to: string[];
  cc: string[];
  bcc: string[];
  fax: string[];
}