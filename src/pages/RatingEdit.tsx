import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CalculatorIcon, CircleMinusIcon, CirclePlusIcon, CircleXIcon, FileXIcon, InfoIcon, SaveIcon, StickyNoteIcon } from 'lucide-react';
import { impairmentCodes } from '../data/impairmentCodes';
import { multMethods, underwriters } from '../data/underwriters';
import { useCase } from '../hooks/useCase';
import { useRatingForm } from '../hooks/useRatingForm';
import { RichTextEditor } from '../components/email/RichTextEditor';
import { CaseLayout } from '../components/case/CaseLayout';
import { Column, DataTable } from '../components/DataTable';
import { EmptyState } from '../components/layout/EmptyState';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { IconButton } from '../components/ui/IconButton';
import { Modal } from '../components/ui/Modal';
import { Panel } from '../components/ui/Panel';
import { Select } from '../components/ui/Select';
import { TextInput } from '../components/ui/TextInput';
import { ValueRow } from '../components/ui/ValueRow';

function Hint({ text }: {text: string;}) {
  return (
    <span title={text} className="text-brand-600">
      <InfoIcon className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{text}</span>
    </span>);

}

const fmt = (n: number | undefined) => n === undefined ? '—' : n.toFixed(2);

export function RatingEdit() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const c = useCase(caseId);
  const form = useRatingForm(c);
  const [addOpen, setAddOpen] = useState(false);
  const [codeToAdd, setCodeToAdd] = useState(impairmentCodes[1].code);

  if (!c) return <EmptyState icon={<FileXIcon />} title="Case not found" action={<Link to="/" className="link text-sm">Back to Home Workspace</Link>} />;

  const { fields, setters, results, finalRatedAge, errors } = form;
  const ratedUp = results && finalRatedAge !== null ? `${results.ratedAge - form.age} / ${finalRatedAge - form.age}` : '— / —';
  const codeLabel = (code: string) => impairmentCodes.find((i) => i.code === code)?.label ?? code;
  const noteHtml = fields.note.join('<br>');

  const secondaryColumns: Column<string>[] = [
  { key: 'code', header: 'Impairment Code', sortValue: (r) => r, render: (r) => codeLabel(r) },
  {
    key: 'remove',
    header: 'Remove',
    hideHeaderLabel: true,
    className: 'w-12',
    render: (r) =>
    <IconButton label={`Remove ${codeLabel(r)}`} variant="danger" size="sm" onClick={() => setters.setSecondaryCodes(fields.secondaryCodes.filter((x) => x !== r))}>
          <CircleMinusIcon />
        </IconButton>

  }];


  return (
    <CaseLayout
      caseRecord={c}
      title={`Rating Activity for ${c.claimantName}`}
      titleAction={
      <IconButton label="Add rating activity" size="sm" className="text-brand-600">
          <CirclePlusIcon />
        </IconButton>
      }>
      
      <Panel
        title="Edit Rating Activity"
        actions={
        <>
            <Button size="sm" variant="primary" leadingIcon={<SaveIcon />} loading={form.saving === 'save'} onClick={form.save}>
              Save
            </Button>
            <Button size="sm" variant="danger" leadingIcon={<CircleXIcon />} disabled={!!form.saving} onClick={() => navigate(`/case/${c.caseNumber}/rating`)}>
              Cancel
            </Button>
            <Button size="sm" leadingIcon={<StickyNoteIcon />} loading={form.saving === 'note'} onClick={form.saveNote}>
              Save Note
            </Button>
          </>
        }>
        
        {errors.calc && <Alert tone="warning" className="mb-4">{errors.calc}</Alert>}
        <div className="grid gap-x-8 gap-y-6 lg:grid-cols-2 2xl:grid-cols-[1fr_1fr_1.3fr]">
          <div className="space-y-3">
            <Field label="Date Evaluated" htmlFor="ra-date" layout="inline" error={errors.dateEvaluated}>
              <TextInput id="ra-date" className="w-36" value={fields.dateEvaluated} invalid={!!errors.dateEvaluated} aria-describedby={errors.dateEvaluated ? 'ra-date-error' : undefined} onChange={(e) => {setters.setDateEvaluated(e.target.value);form.clearError('dateEvaluated');}} />
            </Field>
            <dl>
              <ValueRow label="DOB">{c.dob}</ValueRow>
              <ValueRow label="Age">{form.age}</ValueRow>
              <ValueRow label="Gender">{c.gender}</ValueRow>
            </dl>
            <Field label="Mult Method" htmlFor="ra-method" layout="inline">
              <Select id="ra-method" wrapperClassName="w-36" value={fields.multMethod} onChange={(e) => setters.setMultMethod(e.target.value)}>
                {multMethods.map((m) =>
                <option key={m}>{m}</option>
                )}
              </Select>
            </Field>
            <Field label="Mult (%)" htmlFor="ra-mult" layout="inline" error={errors.mult}>
              <div className="flex items-center gap-2">
                <TextInput id="ra-mult" className="w-36" inputMode="numeric" value={fields.mult} invalid={!!errors.mult} aria-describedby={errors.mult ? 'ra-mult-error' : undefined} onChange={(e) => {setters.setMult(e.target.value);form.clearError('mult');}} />
                <Hint text="Mortality multiplier applied to the standard life expectancy table (100 = standard)." />
              </div>
            </Field>
            <div className="sm:pl-[144px]">
              <Button leadingIcon={<CalculatorIcon />} loading={form.calculating} onClick={form.calculate}>
                Calculate Rated Age
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Field label="Underwriter" htmlFor="ra-underwriter" layout="inline">
              <Select id="ra-underwriter" wrapperClassName="max-w-[220px]" value={fields.underwriter} onChange={(e) => setters.setUnderwriter(e.target.value)}>
                {underwriters.map((u) =>
                <option key={u}>{u}</option>
                )}
              </Select>
            </Field>
            <dl aria-live="polite" className={form.calculating ? 'opacity-50 transition-opacity duration-150' : 'transition-opacity duration-150'}>
              <ValueRow label="Normal L.E.">{fmt(results?.normalLE)}</ValueRow>
              <ValueRow label="75% Normal L.E.">{fmt(results?.normalLE75)}</ValueRow>
              <ValueRow label="Estimated L.E.">{fmt(results?.estimatedLE)}</ValueRow>
              <ValueRow label="Rated Age">{results?.ratedAge ?? '—'}</ValueRow>
              <div className="grid grid-cols-[132px_minmax(0,1fr)] items-center gap-3 py-1">
                <dt className="text-right text-[13px] text-ink-500">Final Rated Age</dt>
                <dd className="flex items-center gap-1.5">
                  <IconButton label="Decrease final rated age" variant="danger" size="sm" disabled={finalRatedAge === null || finalRatedAge <= form.age} onClick={() => form.adjustFinal(-1)}>
                    <CircleMinusIcon />
                  </IconButton>
                  <output aria-label="Final Rated Age" className="min-w-[44px] rounded-md border border-ink-200 bg-ink-50 px-2 py-1 text-center text-sm font-semibold tabular-nums text-danger-600">
                    {finalRatedAge ?? '—'}
                  </output>
                  <IconButton label="Increase final rated age" size="sm" className="text-success-700 hover:bg-success-50" disabled={finalRatedAge === null} onClick={() => form.adjustFinal(1)}>
                    <CirclePlusIcon />
                  </IconButton>
                  <Hint text="Adjust only when the underwriter overrides the calculated rated age." />
                </dd>
              </div>
              <ValueRow label="# Yrs Rated Up">{ratedUp}</ValueRow>
            </dl>
            <Field label="Response Date" htmlFor="ra-response" layout="inline" error={errors.responseDate}>
              <TextInput id="ra-response" className="w-36" value={fields.responseDate} invalid={!!errors.responseDate} onChange={(e) => {setters.setResponseDate(e.target.value);form.clearError('responseDate');}} />
            </Field>
            <Field label="Expiration Date" htmlFor="ra-expiration" layout="inline" error={errors.expirationDate}>
              <div className="flex items-center gap-2">
                <TextInput id="ra-expiration" className="w-36" value={fields.expirationDate} invalid={!!errors.expirationDate} onChange={(e) => {setters.setExpirationDate(e.target.value);form.clearError('expirationDate');}} />
                <Hint text="Rated age confirmations are valid for 12 months from the date evaluated." />
              </div>
            </Field>
          </div>

          <div className="lg:col-span-2 2xl:col-span-1 2xl:row-span-2">
            <RichTextEditor id="ra-note" label="Underwriter Note" initialHtml={noteHtml} minHeight={260} onChange={(t) => setters.setNote(t.split('\n').filter((l) => l.trim()))} />
          </div>

          <section aria-labelledby="impairment-title" className="space-y-4 border-t border-ink-100 pt-5 lg:col-span-2">
            <h3 id="impairment-title" className="text-sm font-semibold text-ink-900">
              Impairment Codes
            </h3>
            <Field label="Primary Impairment Code" htmlFor="ra-primary" layout="inline" className="sm:grid-cols-[170px_minmax(0,1fr)]">
              <Select id="ra-primary" wrapperClassName="max-w-lg" value={fields.primaryCode} onChange={(e) => setters.setPrimaryCode(e.target.value)}>
                {impairmentCodes.map((i) =>
                <option key={i.code} value={i.code}>
                    {i.label}
                  </option>
                )}
              </Select>
            </Field>
            <div className="rounded-md border border-ink-200">
              <div className="flex items-center gap-1.5 px-4 pt-3">
                <h4 className="text-[13px] font-semibold text-ink-900">Secondary Impairment Codes</h4>
                <IconButton label="Add secondary impairment code" size="sm" className="text-brand-600" onClick={() => setAddOpen(true)}>
                  <CirclePlusIcon />
                </IconButton>
              </div>
              <DataTable
                id="secondary-codes"
                label="Secondary Impairment Codes"
                columns={secondaryColumns}
                rows={fields.secondaryCodes}
                defaultPageSize={10}
                toolbar="search"
                getRowId={(r) => r}
                getSearchText={(r) => codeLabel(r)} />
              
            </div>
          </section>
        </div>
      </Panel>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add secondary impairment code"
        footer={
        <>
            <Button onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button
            variant="primary"
            onClick={() => {
              if (!fields.secondaryCodes.includes(codeToAdd)) setters.setSecondaryCodes([...fields.secondaryCodes, codeToAdd]);
              setAddOpen(false);
            }}>
            
              Add Code
            </Button>
          </>
        }>
        
        <Field label="Impairment Code" htmlFor="add-code">
          <Select id="add-code" value={codeToAdd} onChange={(e) => setCodeToAdd(e.target.value)}>
            {impairmentCodes.
            filter((i) => i.code !== fields.primaryCode).
            map((i) =>
            <option key={i.code} value={i.code}>
                  {i.label}
                </option>
            )}
          </Select>
        </Field>
      </Modal>
    </CaseLayout>);

}