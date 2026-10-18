import { CaseRecord } from '../types/case';

export const cases: CaseRecord[] = [
{
  caseNumber: '26-01867',
  claimantName: 'SHEILA STUART',
  initials: 'SS',
  dob: '09/07/1961',
  gender: 'Female',
  ageNow: '64 years, 6 months',
  createdBy: 'Karishma Singh',
  createdOn: 'Apr 01, 2026',
  status: 'Rated*',
  flags: { rush: false, rework: false, mediation: false, msa: false, wc: true },
  underwriter: {
    name: 'Stacey Angoy',
    initials: 'SA',
    role: 'Underwriter',
    email: 'stacey_angoy@newyorklife.com',
    phone: '212-576-4874',
    address: 'Remote- Home, Lilburn, Georgia 30047 United States'
  },
  broker: { firm: 'BRANT HICKEY & ASSOCIATES', city: 'Chicago', cityCode: 'CHICA', contact: 'KELSEY TAYLOR', email: 'ktaylor@branthickey.com' },
  rating: {
    dateEvaluated: '04/01/2026',
    multMethod: 'AT',
    mult: 100,
    age: 65,
    normalLE: 20.72,
    normalLE75: 15.54,
    estimatedLE: 20.72,
    calculatedRatedAge: 65,
    finalRatedAge: 65,
    responseDate: '04/01/2026',
    expirationDate: '04/01/2027',
    underwriter: 'Stacey Angoy (2)',
    primaryImpairmentCode: '0300',
    secondaryImpairmentCodes: [],
    note: [
    '4/1/2026 BRANT/CHICA- SIXFOLD CASE',
    'AA 64',
    'DOI 7/9/2020',
    'CERVICAL DISC DISPLACEMENT',
    'ROTATOR CUFF TEAR R SHOULDER',
    'CARPAL TUNNEL SYND',
    'OA R WRIST',
    'STD LE 20.72 RA 65 SA',
    'SUMMARY ONLY']

  },
  raSheet: { fileName: '26-01867-BRANT-CHICA-RASheet.pdf', comment: '', createdBy: 'Stacey Angoy', createdOn: 'Apr 01, 2026 02:32 PM' },
  timeline: [
  { id: 't1', kind: 'note', title: 'Note Created', link: 'NYL RA for SHEILA STUART Case # 26-01867', by: 'Stacey Angoy', on: 'Apr 01, 2026' },
  { id: 't2', kind: 'document', title: 'Document(s) Uploaded', link: '26-01867-BRANT-CHICA-RASheet.pdf', by: 'Stacey Angoy', on: 'Apr 01, 2026' },
  { id: 't3', kind: 'rated', title: 'RA Rated*', by: 'Stacey Angoy', on: 'Apr 01, 2026' },
  { id: 't4', kind: 'document', title: 'Document(s) Uploaded', link: 'Pages From MSAMedRecs Stuart S.03.26.pdf', by: 'Karishma Singh', on: 'Apr 01, 2026' },
  { id: 't5', kind: 'requested', title: 'RA Requested', by: 'Karishma Singh', on: 'Apr 01, 2026' },
  { id: 't6', kind: 'sent', title: 'RA Sent for Underwriting', by: 'Karishma Singh', on: 'Apr 01, 2026' }],

  wall: [
  { id: 'w1', kind: 'email', label: 'Email sent on', at: 'Apr 01, 2026 02:33 PM', subject: 'NYL RA for SHEILA STUART Case # 26-01867', by: 'Stacey Angoy' },
  { id: 'w2', kind: 'note', label: 'Note created on', at: 'Apr 01, 2026 02:32 PM', subject: 'Underwriter Note', by: 'Stacey Angoy' }]

}];
/** Earlier cases already communicated to brokers — they appear only in Reports. */
function communicatedCase(input: {
  caseNumber: string;
  claimantName: string;
  dob: string;
  gender: CaseRecord['gender'];
  ageNow: string;
  on: string;
  broker: CaseRecord['broker'];
  age: number;
  normalLE: number;
  estimatedLE: number;
  finalRatedAge: number;
  impairment: string;
}): CaseRecord {
  const base = cases[0];
  const [mm, dd, yyyy] = input.on.split('/');
  const label = new Date(Number(yyyy), Number(mm) - 1, Number(dd)).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  const fileName = `${input.caseNumber}-${input.broker.firm.split(' ')[0]}-${input.broker.cityCode}-RASheet.pdf`;
  return {
    ...base,
    caseNumber: input.caseNumber,
    claimantName: input.claimantName,
    initials: input.claimantName.split(' ').map((p) => p[0]).join('').slice(0, 2),
    dob: input.dob,
    gender: input.gender,
    ageNow: input.ageNow,
    createdOn: label,
    status: 'CS Communicated',
    flags: { rush: false, rework: false, mediation: false, msa: false, wc: false },
    broker: input.broker,
    rating: {
      ...base.rating!,
      dateEvaluated: input.on,
      responseDate: input.on,
      expirationDate: `${mm}/${dd}/${Number(yyyy) + 1}`,
      age: input.age,
      normalLE: input.normalLE,
      normalLE75: Number((input.normalLE * 0.75).toFixed(2)),
      estimatedLE: input.estimatedLE,
      calculatedRatedAge: input.finalRatedAge,
      finalRatedAge: input.finalRatedAge,
      primaryImpairmentCode: input.impairment,
      note: [`${Number(mm)}/${Number(dd)}/${yyyy} ${input.broker.cityCode}`, `STD LE ${input.normalLE} RA ${input.finalRatedAge} SA`]
    },
    raSheet: { fileName, comment: '', createdBy: base.underwriter.name, createdOn: `${label} 11:05 AM` },
    timeline: [
    { id: 't1', kind: 'note', title: 'Note Created', link: `NYL RA for ${input.claimantName} Case # ${input.caseNumber}`, by: base.underwriter.name, on: label },
    { id: 't2', kind: 'document', title: 'Document(s) Uploaded', link: fileName, by: base.underwriter.name, on: label },
    { id: 't3', kind: 'rated', title: 'RA Rated*', by: base.underwriter.name, on: label },
    { id: 't4', kind: 'sent', title: 'RA Sent for Underwriting', by: 'Karishma Singh', on: label }],

    wall: [
    { id: 'w1', kind: 'email', label: 'Email sent on', at: `${label} 11:12 AM`, subject: `NYL RA for ${input.claimantName} Case # ${input.caseNumber}`, by: base.underwriter.name },
    { id: 'w2', kind: 'note', label: 'Note created on', at: `${label} 11:05 AM`, subject: 'Underwriter Note', by: base.underwriter.name }]

  };
}

cases.push(
  communicatedCase({
    caseNumber: '26-01842', claimantName: 'MARCUS BELL', dob: '02/11/1958', gender: 'Male', ageNow: '68 years, 1 month', on: '03/27/2026',
    broker: { firm: 'ALLIANT INSURANCE SERVICES', city: 'Newport Beach', cityCode: 'NEWPO', contact: 'OLIVIA BERMUDEZ', email: 'Olivia.Bermudez@alliant.com' },
    age: 68, normalLE: 16.41, estimatedLE: 12.9, finalRatedAge: 73, impairment: '0100'
  }),
  communicatedCase({
    caseNumber: '26-01829', claimantName: 'DENISE OKAFOR', dob: '06/30/1972', gender: 'Female', ageNow: '53 years, 9 months', on: '03/24/2026',
    broker: { firm: 'ARCADIA SETTLEMENTS GROUP', city: 'Greenville', cityCode: 'GRVIL', contact: 'VICTORIA KOSIBA', email: 'vkosiba@teamarcadia.com' },
    age: 54, normalLE: 29.85, estimatedLE: 26.1, finalRatedAge: 58, impairment: '0600'
  }),
  communicatedCase({
    caseNumber: '26-01811', claimantName: 'ROBERT HALVERSEN', dob: '11/05/1949', gender: 'Male', ageNow: '76 years, 4 months', on: '03/19/2026',
    broker: { firm: 'BRANT HICKEY & ASSOCIATES', city: 'Chicago', cityCode: 'CHICA', contact: 'KELSEY TAYLOR', email: 'ktaylor@branthickey.com' },
    age: 76, normalLE: 11.02, estimatedLE: 9.4, finalRatedAge: 79, impairment: '0300'
  })
);
