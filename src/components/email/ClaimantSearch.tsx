import React, { useEffect, useRef, useState } from 'react';
import { ChevronsRightIcon, LoaderCircleIcon, SearchIcon } from 'lucide-react';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { existingClaimants } from '../../data/claimants';
import { ExistingClaimant } from '../../types/workspace';
import { formatUSDate, parseUSDate } from '../../utils/date';
import { Column, DataTable } from '../DataTable';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { Field } from '../ui/Field';
import { Radio } from '../ui/Radio';
import { Select } from '../ui/Select';
import { TextInput } from '../ui/TextInput';

interface ClaimantSearchProps {
  onNewClaimant: () => void;
  onOpenClaimant: (claimant: ExistingClaimant) => void;
}

export function ClaimantSearch({ onNewClaimant, onOpenClaimant }: ClaimantSearchProps) {
  const { queue } = useWorkspace();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [caseNo, setCaseNo] = useState('');
  const [years, setYears] = useState('all');
  const [formError, setFormError] = useState<string | null>(null);
  const [dobError, setDobError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'searching' | 'done'>('idle');
  const [results, setResults] = useState<ExistingClaimant[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const pool: ExistingClaimant[] = [
  ...existingClaimants,
  ...queue.
  filter((q) => !existingClaimants.some((c) => c.caseNumber === q.caseNumber)).
  map((q) => {
    const parts = q.claimant.replace(/\s*\(\d+\)$/, '').split(' ');
    return { id: q.id, name: `${parts.slice(1).join(' ')}, ${parts[0]}`, dob: q.dob, brokers: q.sender.split(' (')[0], caseNumber: q.caseNumber };
  })];


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setDobError(null);
    if (!name.trim() && !dob.trim() && !caseNo.trim()) {
      setFormError('Enter a claimant name, DOB, or GRA/Case number to search.');
      return;
    }
    const dobDate = dob.trim() ? parseUSDate(dob) : null;
    if (dob.trim() && !dobDate) {
      setDobError('Use the format MM/DD/YYYY.');
      return;
    }
    setStatus('searching');
    setSelectedId(null);
    timer.current = window.setTimeout(() => {
      const tokens = name.trim().toLowerCase().split(/[\s,]+/).filter(Boolean);
      const found = pool.filter((c) => {
        const n = c.name.toLowerCase();
        return (
          tokens.every((t) => n.includes(t)) && (
          !dobDate || c.dob === formatUSDate(dobDate)) && (
          !caseNo.trim() || c.caseNumber.includes(caseNo.trim())));

      });
      setResults(found);
      setStatus('done');
    }, 500);
  };

  const handleCancel = () => {
    window.clearTimeout(timer.current);
    setName('');
    setDob('');
    setCaseNo('');
    setYears('all');
    setFormError(null);
    setDobError(null);
    setResults([]);
    setSelectedId(null);
    setStatus('idle');
  };

  const selected = results.find((r) => r.id === selectedId);

  const columns: Column<ExistingClaimant>[] = [
  {
    key: 'select',
    header: 'Select',
    hideHeaderLabel: true,
    className: 'w-10',
    render: (r) => <Radio name="claimant-result" label={`Select ${r.name}`} srOnlyLabel checked={selectedId === r.id} onChange={() => setSelectedId(r.id)} />
  },
  {
    key: 'claimant',
    header: 'Claimant',
    sortValue: (r) => r.name,
    render: (r) =>
    <button type="button" className="link text-left" onClick={() => onOpenClaimant(r)}>
          {r.name}
          <span className="block text-xs font-normal text-ink-500">
            DOB {r.dob} · {r.caseNumber}
          </span>
        </button>

  },
  { key: 'brokers', header: 'Broker(s)', sortValue: (r) => r.brokers, render: (r) => r.brokers }];


  return (
    <section aria-labelledby="claimant-search-title" className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-ink-200 bg-ink-50 px-4 py-2">
        <h2 id="claimant-search-title" className="text-sm font-semibold text-ink-900">
          Search Claimant
        </h2>
        <Button size="sm" trailingIcon={<ChevronsRightIcon />} onClick={onNewClaimant}>
          New Claimant
        </Button>
      </div>

      <form onSubmit={handleSearch} noValidate className="space-y-3 px-4 py-4">
        {formError && <Alert tone="danger">{formError}</Alert>}
        <Field label="Claimant" htmlFor="search-claimant">
          <TextInput id="search-claimant" value={name} onChange={(e) => setName(e.target.value)} placeholder="Last name, first name" autoComplete="off" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Claimant DOB" htmlFor="search-dob" error={dobError ?? undefined}>
            <TextInput
              id="search-dob"
              value={dob}
              invalid={!!dobError}
              aria-describedby={dobError ? 'search-dob-error' : undefined}
              onChange={(e) => setDob(e.target.value)}
              placeholder="MM/DD/YYYY"
              inputMode="numeric" />
            
          </Field>
          <Field label="GRA/Case Number" htmlFor="search-case">
            <TextInput id="search-case" value={caseNo} onChange={(e) => setCaseNo(e.target.value)} />
          </Field>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-ink-700">
          <label htmlFor="search-years">Records up to last</label>
          <Select id="search-years" selectSize="sm" wrapperClassName="w-20" value={years} onChange={(e) => setYears(e.target.value)}>
            <option value="all">All</option>
            <option value="1">1</option>
            <option value="3">3</option>
            <option value="5">5</option>
          </Select>
          <span>yrs</span>
        </div>
        <div className="flex justify-center gap-2 pt-1">
          <Button type="submit" variant="primary" size="sm" leadingIcon={<SearchIcon />} loading={status === 'searching'}>
            Search
          </Button>
          <Button size="sm" variant="danger" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>

      {status !== 'idle' &&
      <div className="border-t border-ink-200 pt-3">
          <h3 className="px-4 text-sm font-semibold text-ink-900" aria-live="polite">
            Claimants({status === 'searching' ? '…' : results.length})
          </h3>
          {status === 'searching' ?
        <p className="flex items-center justify-center gap-2 py-8 text-[13px] text-ink-500">
              <LoaderCircleIcon className="h-4 w-4 animate-spin" aria-hidden="true" />
              Searching claimants…
            </p> :

        <>
              <DataTable
            id="claimant-results"
            label="Claimants"
            toolbar="search"
            columns={columns}
            rows={results}
            getRowId={(r) => r.id}
            getSearchText={(r) => `${r.name} ${r.brokers}`} />
          
              {results.length === 0 &&
          <div className="px-4">
                  <Alert tone="info">No existing claimant matches. Create a new claimant to continue.</Alert>
                </div>
          }
              <div className="flex justify-center gap-2 px-4 py-4">
                <Button size="sm" trailingIcon={<ChevronsRightIcon />} disabled={!selected} onClick={() => selected && onOpenClaimant(selected)}>
                  Next
                </Button>
                <Button size="sm" variant="primary" trailingIcon={<ChevronsRightIcon />} onClick={onNewClaimant}>
                  New Claimant
                </Button>
              </div>
            </>
        }
        </div>
      }
    </section>);

}