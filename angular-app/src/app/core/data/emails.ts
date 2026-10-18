import { EmailMessage } from '../types/workspace';

export const emails: EmailMessage[] = [
{
  inboxId: 'in-5',
  sentAt: 'Wed, 4/1/2026 01:46:21 PM',
  claimantLine: 'Jon Eldridge',
  to: 'Kelsey Taylor <ktaylor@branthickey.com>',
  attachments: [
  { id: 'att-52016', name: '52016520230328014478001.pdf', title: 'DR-Impartial Medical Report - IMP MED REPORT' },
  { id: 'att-30016', name: '30016202603162003830001.pdf', title: 'DR-Impartial Medical Report - IMP MED REPORT' }],

  body: [
  ['Hello,'],
  ['I am requesting a rated age for the following claimant:'],
  ['DOB: 5/25/1973', 'DOA: 8/15/2019', 'Y2P C 69811', 'Agent: Dave Hickey'],
  ['Thank you,']],

  signature: ['Kelsey Taylor', 'Case Manager', 'Brant Hickey & Associates', 'Corporate Office', '17 N State Street – Suite 1530', 'Chicago, IL 60602'],
  prefill: { first: 'JON', last: 'ELDRIDGE', dob: '05/25/1973', gender: 'Male' },
  broker: { id: 'b-brant', name: 'BRANT HICKEY & ASSOCIATES', city: 'CHICA', contact: 'KELSEY TAYLOR', emailFax: 'E: ktaylor@branthickey.com' }
},
{
  inboxId: 'in-6',
  sentAt: 'Wed, 4/1/2026 01:46:02 PM',
  claimantLine: 'Stuart, Sheila',
  to: 'Kelsey Taylor <ktaylor@branthickey.com>',
  attachments: [
  { id: 'att-msamed', name: 'Pages From MSAMedRecs Stuart S.03.26.pdf', title: 'Pages From MSAMedRecs Stuart S.03.26' }],

  body: [
  ['Hello,'],
  ['I am requesting a rated age for the following claimant:'],
  ['DOB: 9/7/1961', 'DOI: 7/9/2020', 'Agent: Dave Hickey'],
  ['Thank you,']],

  signature: ['Kelsey Taylor', 'Case Manager', 'Brant Hickey & Associates', 'Corporate Office', '17 N State Street – Suite 1530', 'Chicago, IL 60602'],
  prefill: { first: 'SHEILA', last: 'STUART', dob: '09/07/1961', gender: 'Female' },
  broker: { id: 'b-brant', name: 'BRANT HICKEY & ASSOCIATES', city: 'CHICA', contact: 'KELSEY TAYLOR', emailFax: 'E: ktaylor@branthickey.com' }
}];