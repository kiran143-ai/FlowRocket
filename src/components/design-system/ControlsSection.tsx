import React from 'react';
import { SaveIcon, SearchIcon, Trash2Icon } from 'lucide-react';
import { Button, ButtonVariant } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { Field } from '../ui/Field';
import { IconButton } from '../ui/IconButton';
import { Radio } from '../ui/Radio';
import { Select } from '../ui/Select';
import { TextInput } from '../ui/TextInput';
import { DemoLabel, DocSection } from './DocSection';

const variants: {variant: ButtonVariant;name: string;usage: string;hover: string;active: string;}[] = [
{ variant: 'primary', name: 'Primary', usage: 'One per view: Save & Close, Search, Send', hover: 'bg-brand-700', active: 'bg-brand-800' },
{ variant: 'secondary', name: 'Secondary', usage: 'Save & Open, Reply, Next »', hover: 'bg-ink-50 border-ink-300', active: 'bg-ink-100' },
{ variant: 'ghost', name: 'Ghost', usage: 'Previous / Next, header links', hover: 'bg-ink-100 text-ink-900', active: 'bg-ink-200' },
{ variant: 'danger', name: 'Danger', usage: 'Cancel, Trash', hover: 'bg-danger-50 border-danger-500', active: 'bg-danger-100' }];


const focus = 'ring-2 ring-brand-500 ring-offset-2';
const states = ['Default', 'Hover', 'Focus', 'Active', 'Disabled', 'Loading'];

export function ControlsSection() {
  return (
    <>
      <DocSection id="buttons" title="Buttons" description="Two sizes: md (36px) for page actions and sm (32px) for toolbars and table actions. Labels never wrap.">
        <div className="overflow-x-auto rounded-lg border border-ink-200 bg-white">
          <table className="w-full min-w-[820px] text-[13px]">
            <thead className="bg-ink-50 text-left text-xs font-semibold text-ink-700">
              <tr>
                <th scope="col" className="px-4 py-2.5">Variant</th>
                {states.map((s) =>
                <th key={s} scope="col" className="px-3 py-2.5">{s}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {variants.map((v) =>
              <tr key={v.variant} className="border-t border-ink-100">
                  <th scope="row" className="px-4 py-3 text-left align-middle">
                    <p className="font-semibold text-ink-900">{v.name}</p>
                    <p className="text-xs font-normal text-ink-500">{v.usage}</p>
                  </th>
                  <td className="px-3 py-3"><Button variant={v.variant} size="sm">Save</Button></td>
                  <td className="px-3 py-3"><Button variant={v.variant} size="sm" className={v.hover} tabIndex={-1}>Save</Button></td>
                  <td className="px-3 py-3"><Button variant={v.variant} size="sm" className={focus} tabIndex={-1}>Save</Button></td>
                  <td className="px-3 py-3"><Button variant={v.variant} size="sm" className={v.active} tabIndex={-1}>Save</Button></td>
                  <td className="px-3 py-3"><Button variant={v.variant} size="sm" disabled>Save</Button></td>
                  <td className="px-3 py-3"><Button variant={v.variant} size="sm" loading>Save</Button></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-6 rounded-lg border border-ink-200 bg-white p-4">
          <div>
            <DemoLabel>With icon · md</DemoLabel>
            <div className="flex gap-2">
              <Button variant="primary" leadingIcon={<SearchIcon />}>Search</Button>
              <Button leadingIcon={<SaveIcon />}>Save Note</Button>
            </div>
          </div>
          <div>
            <DemoLabel>Icon buttons (aria-label required)</DemoLabel>
            <div className="flex gap-1">
              <IconButton label="Save"><SaveIcon /></IconButton>
              <IconButton label="Save" variant="outline"><SaveIcon /></IconButton>
              <IconButton label="Trash" variant="danger"><Trash2Icon /></IconButton>
              <span className="rounded-md bg-brand-600 p-1">
                <IconButton label="Search" variant="onBrand"><SearchIcon /></IconButton>
              </span>
            </div>
          </div>
        </div>
      </DocSection>

      <DocSection id="inputs" title="Inputs" description="Labels always stay visible above or beside the field, never as placeholder only. Errors explain how to fix the problem.">
        <div className="grid gap-5 rounded-lg border border-ink-200 bg-white p-5 sm:grid-cols-2 xl:grid-cols-4">
          <Field label="Default" htmlFor="ds-in-default" hint="Claimant last name">
            <TextInput id="ds-in-default" placeholder="Last name" />
          </Field>
          <Field label="Hover" htmlFor="ds-in-hover">
            <TextInput id="ds-in-hover" placeholder="Last name" className="border-ink-300" tabIndex={-1} />
          </Field>
          <Field label="Focus" htmlFor="ds-in-focus">
            <TextInput id="ds-in-focus" defaultValue="ELDRIDGE" className="border-brand-500 ring-2 ring-brand-500/25" tabIndex={-1} />
          </Field>
          <Field label="Filled" htmlFor="ds-in-filled">
            <TextInput id="ds-in-filled" defaultValue="05/25/1973" />
          </Field>
          <Field label="Disabled" htmlFor="ds-in-disabled">
            <TextInput id="ds-in-disabled" defaultValue="26-01867" disabled />
          </Field>
          <Field label="Read-only" htmlFor="ds-in-readonly">
            <TextInput id="ds-in-readonly" defaultValue="Female" readOnly />
          </Field>
          <Field label="Error" htmlFor="ds-in-error" error="Use the format MM/DD/YYYY.">
            <TextInput id="ds-in-error" defaultValue="5-25-73" invalid aria-describedby="ds-in-error-error" />
          </Field>
          <Field label="Success" htmlFor="ds-in-success" success="Claimant found in the system.">
            <TextInput id="ds-in-success" defaultValue="STUART" className="border-success-600" aria-describedby="ds-in-success-success" />
          </Field>
          <Field label="With icon (search)" htmlFor="ds-in-search" className="sm:col-span-2">
            <TextInput id="ds-in-search" type="search" inputSize="sm" placeholder="Search" leadingIcon={<SearchIcon />} />
          </Field>
          <Field label="Inline layout" htmlFor="ds-in-inline" layout="inline" className="sm:col-span-2">
            <TextInput id="ds-in-inline" defaultValue="04/01/2026" className="w-36" />
          </Field>
        </div>
      </DocSection>

      <DocSection id="dropdowns" title="Dropdowns, checkboxes & radios" description="Native controls keep keyboard and screen reader behavior, styled to match the input tokens.">
        <div className="grid gap-5 rounded-lg border border-ink-200 bg-white p-5 lg:grid-cols-3">
          <div className="space-y-4">
            <Field label="Status" htmlFor="ds-sel-default">
              <Select id="ds-sel-default" defaultValue="Ready for UW">
                <option>Ready for UW</option>
                <option>Rated*</option>
                <option>CS Communicated</option>
              </Select>
            </Field>
            <Field label="Underwriter (disabled)" htmlFor="ds-sel-disabled">
              <Select id="ds-sel-disabled" disabled>
                <option>Stacey Angoy (2)</option>
              </Select>
            </Field>
            <Field label="Gender (error)" htmlFor="ds-sel-error" error="Select a gender.">
              <Select id="ds-sel-error" invalid aria-describedby="ds-sel-error-error">
                <option>Select</option>
              </Select>
            </Field>
          </div>
          <fieldset className="space-y-2.5">
            <legend className="mb-2 text-[13px] font-medium text-ink-700">Checkbox</legend>
            <Checkbox label="Rush (checked)" defaultChecked />
            <Checkbox label="Rework (unchecked)" />
            <Checkbox label="MSA (disabled)" disabled />
            <Checkbox label="WC (checked, disabled)" disabled defaultChecked />
          </fieldset>
          <fieldset className="space-y-2.5">
            <legend className="mb-2 text-[13px] font-medium text-ink-700">Attach Medical (radio)</legend>
            <Radio name="ds-radio" label="Email" />
            <Radio name="ds-radio" label="Attachment(s)" />
            <Radio name="ds-radio" label="Both" defaultChecked />
            <Radio name="ds-radio" label="Do Not Attach (disabled)" disabled />
          </fieldset>
        </div>
      </DocSection>
    </>);

}