import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CircleMinusIcon, MailIcon, MailXIcon, MenuIcon } from 'lucide-react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { underwriters } from '../data/underwriters';
import { useNewClaimantForm } from '../hooks/useNewClaimantForm';
import { EmailViewer } from '../components/email/EmailViewer';
import { EmptyState } from '../components/layout/EmptyState';
import { WindowBar } from '../components/layout/WindowBar';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { Field } from '../components/ui/Field';
import { IconButton } from '../components/ui/IconButton';
import { Radio } from '../components/ui/Radio';
import { Select } from '../components/ui/Select';
import { TextInput } from '../components/ui/TextInput';
import { CaseStatus, Gender } from '../types/workspace';
import { getEmail } from '../utils/email';

const statuses: CaseStatus[] = ['Ready for UW', 'Rated*', 'CS Communicated'];
const attachOptions = [
{ value: 'email', label: 'Email' },
{ value: 'attachments', label: 'Attachment(s)' },
{ value: 'both', label: 'Both' },
{ value: 'none', label: 'Do Not Attach' }] as
const;

const err = (id: string, e?: string) => e ? `${id}-error` : undefined;

export function NewClaimant() {
  const { emailId } = useParams();
  const navigate = useNavigate();
  const { inbox } = useWorkspace();
  const item = inbox.find((i) => i.id === emailId);
  const email = item ? getEmail(item) : undefined;
  const { values, set, errors, age, saving, submit, removeBroker } = useNewClaimantForm(item, email);

  if (!item || !email) {
    return <EmptyState icon={<MailXIcon />} title="Email not found" action={<Link to="/" className="link text-sm">Back to Home Workspace</Link>} />;
  }

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <div className="flex min-h-[calc(100vh-88px)] flex-col">
      <WindowBar title={item.subject} icon={<MailIcon />} />
      <div className="grid flex-1 bg-white xl:grid-cols-[minmax(0,1fr)_minmax(380px,460px)]">
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            submit('close');
          }}
          className="min-w-0 border-b border-ink-200 xl:border-b-0 xl:border-r">
          
          <div className="flex items-center justify-between border-b border-ink-200 bg-ink-50 px-4 py-2 lg:px-6">
            <h1 className="text-sm font-semibold text-ink-900">Claimant Information</h1>
            <IconButton label="Claimant options" size="sm">
              <MenuIcon />
            </IconButton>
          </div>

          <div className="space-y-6 px-4 py-5 lg:px-6">
            {errorCount > 0 &&
            <Alert tone="danger" title={`Please fix ${errorCount} ${errorCount === 1 ? 'field' : 'fields'} before saving.`}>
                Required fields are marked with an asterisk.
              </Alert>
            }

            <div className="space-y-3">
              <div className="grid gap-x-3 gap-y-1 sm:grid-cols-[132px_minmax(0,1fr)] sm:items-start">
                <span id="claimant-name-label" className="text-[13px] font-medium text-ink-700 sm:pt-2 sm:text-right">
                  Claimant Name<span className="ml-0.5 text-danger-600" aria-hidden="true">*</span>
                </span>
                <div role="group" aria-labelledby="claimant-name-label" className="grid gap-2 sm:grid-cols-[96px_1fr_1fr_1fr]">
                  <Select aria-label="Prefix" value={values.prefix} onChange={(e) => set('prefix', e.target.value)}>
                    <option value="">Select</option>
                    <option>Mr.</option>
                    <option>Mrs.</option>
                    <option>Ms.</option>
                    <option>Dr.</option>
                  </Select>
                  <div>
                    <TextInput id="claimant-first" aria-label="First name" placeholder="First name" value={values.first} invalid={!!errors.first} aria-describedby={err('claimant-first', errors.first)} onChange={(e) => set('first', e.target.value)} />
                    {errors.first && <p id="claimant-first-error" className="mt-1 text-xs font-medium text-danger-700">{errors.first}</p>}
                  </div>
                  <TextInput aria-label="Middle name" placeholder="Middle name" value={values.middle} onChange={(e) => set('middle', e.target.value)} />
                  <div>
                    <TextInput id="claimant-last" aria-label="Last name" placeholder="Last name" value={values.last} invalid={!!errors.last} aria-describedby={err('claimant-last', errors.last)} onChange={(e) => set('last', e.target.value)} />
                    {errors.last && <p id="claimant-last-error" className="mt-1 text-xs font-medium text-danger-700">{errors.last}</p>}
                  </div>
                </div>
              </div>

              <Field label="AKA" htmlFor="claimant-aka" layout="inline">
                <TextInput id="claimant-aka" className="max-w-sm" placeholder="Also Known As" value={values.aka} onChange={(e) => set('aka', e.target.value)} />
              </Field>

              <div className="grid gap-x-3 gap-y-1 sm:grid-cols-[132px_minmax(0,1fr)] sm:items-start">
                <label htmlFor="claimant-dob" className="text-[13px] font-medium text-ink-700 sm:pt-2 sm:text-right">
                  DOB<span className="ml-0.5 text-danger-600" aria-hidden="true">*</span>
                </label>
                <div className="flex flex-wrap items-start gap-x-6 gap-y-2">
                  <div>
                    <TextInput id="claimant-dob" className="w-36" placeholder="MM/DD/YYYY" inputMode="numeric" value={values.dob} invalid={!!errors.dob} aria-describedby={err('claimant-dob', errors.dob) ?? 'claimant-age'} onChange={(e) => set('dob', e.target.value)} />
                    {errors.dob && <p id="claimant-dob-error" className="mt-1 text-xs font-medium text-danger-700">{errors.dob}</p>}
                  </div>
                  <p id="claimant-age" className="pt-2 text-[13px] text-ink-700">
                    Age <span className="font-semibold text-ink-900">{age ? `${age.years} Years ${age.months} Mo.` : '—'}</span>
                  </p>
                  <div className="flex items-start gap-2">
                    <label htmlFor="claimant-gender" className="pt-2 text-[13px] font-medium text-ink-700">
                      Gender<span className="ml-0.5 text-danger-600" aria-hidden="true">*</span>
                    </label>
                    <div>
                      <Select id="claimant-gender" wrapperClassName="w-32" value={values.gender} invalid={!!errors.gender} aria-describedby={err('claimant-gender', errors.gender)} onChange={(e) => set('gender', e.target.value as Gender | '')}>
                        <option value="">Select</option>
                        <option>Male</option>
                        <option>Female</option>
                      </Select>
                      {errors.gender && <p id="claimant-gender-error" className="mt-1 text-xs font-medium text-danger-700">{errors.gender}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-ink-100 pt-5">
              <div className="grid gap-x-3 gap-y-1 sm:grid-cols-[132px_minmax(0,1fr)]">
                <span className="hidden sm:block" />
                <fieldset className="flex flex-wrap gap-x-5 gap-y-2">
                  <legend className="sr-only">Case flags</legend>
                  <Checkbox label="Rush" checked={values.rush} onChange={(e) => set('rush', e.target.checked)} />
                  <Checkbox label="Rework" checked={values.rework} onChange={(e) => set('rework', e.target.checked)} />
                  <Checkbox label="Mediation" checked={values.mediation} onChange={(e) => set('mediation', e.target.checked)} />
                  <Checkbox label="MSA" checked={values.msa} onChange={(e) => set('msa', e.target.checked)} />
                  <Checkbox label="WC" checked={values.wc} onChange={(e) => set('wc', e.target.checked)} />
                </fieldset>
              </div>
              <div className="grid gap-x-3 gap-y-1 sm:grid-cols-[132px_minmax(0,1fr)] sm:items-start">
                <label htmlFor="claimant-status" className="text-[13px] font-medium text-ink-700 sm:pt-2 sm:text-right">
                  Status
                </label>
                <div className="grid gap-2 sm:grid-cols-2 sm:max-w-lg">
                  <Select id="claimant-status" value={values.status} onChange={(e) => set('status', e.target.value as CaseStatus)}>
                    {statuses.map((s) =>
                    <option key={s}>{s}</option>
                    )}
                  </Select>
                  <div>
                    <Select id="claimant-underwriter" aria-label="Assigned underwriter" value={values.underwriter} invalid={!!errors.underwriter} onChange={(e) => set('underwriter', e.target.value)}>
                      <option value="">Select underwriter</option>
                      {underwriters.map((u) =>
                      <option key={u}>{u}</option>
                      )}
                    </Select>
                    {errors.underwriter && <p className="mt-1 text-xs font-medium text-danger-700">{errors.underwriter}</p>}
                  </div>
                </div>
              </div>
            </div>

            <section aria-labelledby="medicals-title" className="border-t border-ink-100 pt-5">
              <h2 id="medicals-title" className="text-sm font-semibold text-ink-900">
                Medical(s)
              </h2>
              <div className="mt-3 grid gap-x-3 gap-y-1 sm:grid-cols-[132px_minmax(0,1fr)]">
                <span id="attach-medical-label" className="text-[13px] font-medium text-ink-700 sm:text-right">
                  Attach Medical
                </span>
                <div role="radiogroup" aria-labelledby="attach-medical-label" className="flex flex-wrap gap-x-5 gap-y-2">
                  {attachOptions.map((o) =>
                  <Radio key={o.value} name="attach-medical" label={o.label} checked={values.attachMedical === o.value} onChange={() => set('attachMedical', o.value)} />
                  )}
                </div>
              </div>
            </section>

            <section aria-labelledby="brokers-title" className="border-t border-ink-100 pt-5">
              <h2 id="brokers-title" className="text-sm font-semibold text-ink-900">
                Broker(s)
              </h2>
              <div className="mt-3 overflow-x-auto rounded-md border border-ink-200">
                <table className="w-full text-[13px]">
                  <thead className="bg-ink-50 text-left text-xs font-semibold text-ink-700">
                    <tr>
                      <th scope="col" className="px-3 py-2">Broker Name</th>
                      <th scope="col" className="px-3 py-2">Broker City</th>
                      <th scope="col" className="px-3 py-2">Broker Contact</th>
                      <th scope="col" className="px-3 py-2">Email/Fax</th>
                      <th scope="col" className="w-12 px-3 py-2"><span className="sr-only">Remove</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {values.brokers.length ?
                    values.brokers.map((b) =>
                    <tr key={b.id} className="border-t border-ink-100">
                          <td className="px-3 py-2 font-medium">{b.name}</td>
                          <td className="px-3 py-2">{b.city}</td>
                          <td className="px-3 py-2">{b.contact}</td>
                          <td className="px-3 py-2">{b.emailFax}</td>
                          <td className="px-3 py-1.5 text-center">
                            <IconButton label={`Remove ${b.name}`} variant="danger" size="sm" onClick={() => removeBroker(b.id)}>
                              <CircleMinusIcon />
                            </IconButton>
                          </td>
                        </tr>
                    ) :

                    <tr className="border-t border-ink-100">
                        <td colSpan={5} className="px-3 py-6 text-center text-ink-500">No Records Found</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="sticky bottom-0 flex justify-center gap-2 border-t border-ink-200 bg-white/95 px-4 py-3 backdrop-blur">
            <Button type="submit" variant="primary" loading={saving === 'close'} disabled={!!saving && saving !== 'close'}>
              Save &amp; Close
            </Button>
            <Button onClick={() => submit('open')} loading={saving === 'open'} disabled={!!saving && saving !== 'open'}>
              Save &amp; Open
            </Button>
            <Button variant="danger" disabled={!!saving} onClick={() => navigate(`/email/${item.id}`)}>
              Cancel
            </Button>
          </div>
        </form>

        <div className="min-w-0">
          <EmailViewer
            compact
            inbox={item}
            email={email}
            onReply={(mode) => navigate(`/email/${item.id}/reply?mode=${mode}`)}
            onTrash={() => navigate(`/email/${item.id}`)}
            onOpenAttachment={(a) => navigate(`/document/${a.id}?from=${item.id}`)} />
          
        </div>
      </div>
    </div>);

}