import React from 'react';

const parties: [string, string[]][] = [
['Judge:', ['MICHAEL E WILLIAMS']],
['Employee:', ['ELDRIDGE, JON', 'TAUNTON, MA 02780     5082151813']],
["Employee's Attorney:", ['RONALD W STOIA ESQ', 'BROCKTON, MA 02302     508-588-4553']],
['Employer:', ['RJV CONSTRUCTION CORP']],
['Insurance Company:', ['HARTFORD ACCIDENT AND INDEMNITY']],
["Insurer's Attorney:", ['ROGER J DOUCETTE']],
['Date of Injury:', ['08/15/2019']],
['Board Number:', ['2077619']],
['Region of Conference:', ['FALL RIVER']]];


function Box({ checked = false }: {checked?: boolean;}) {
  return (
    <span className="ml-2 inline-grid h-3.5 w-3.5 place-items-center border border-black align-middle text-[10px] leading-none" aria-label={checked ? 'checked' : 'unchecked'}>
      {checked ? 'X' : ''}
    </span>);

}

export function Form461Page() {
  return (
    <div className="min-h-[1056px] px-16 py-14 font-serif text-[13px] leading-relaxed text-black">
      <div className="flex justify-between font-semibold">
        <span>FORM 461</span>
        <span>PRINTED 08/11/2022</span>
      </div>
      <h2 className="mt-8 text-center text-[14px] font-bold">CONFLICT DISCLOSURE FORM TO BE COMPLETED BY PHYSICIAN</h2>
      <dl className="mt-8 grid grid-cols-[200px_1fr] gap-y-1">
        {parties.map(([label, lines]) =>
        <React.Fragment key={label}>
            <dt className="font-bold">{label}</dt>
            <dd className="whitespace-pre">{lines.join('\n')}</dd>
          </React.Fragment>
        )}
      </dl>
      <div className="mt-8 space-y-2">
        <p>
          I.P.E. SELECTION OR SPECIALTY CODE: <span className="underline">NEURO</span>
        </p>
        <p>
          BODY PART: <span className="underline">HEAD, CERVICAL, LEFT SHOULDER</span>
        </p>
        <p className="flex justify-between">
          <span>
            CHECK IF I.P.E. SELECTED BY PARTIES <Box checked />
          </span>
          <span>
            OR JUDGE APPOINTED <Box />
          </span>
        </p>
        <p>SECOND I.P.E. SELECTION OR SPECIALTY CODE:</p>
        <p className="flex justify-between">
          <span>
            APPROVED BY JUDGE <Box />
          </span>
          <span>
            RESPONSIBLE PAYING PARTY <Box />
          </span>
        </p>
      </div>
      <div className="mt-10 border-t border-black pt-4">
        <p className="font-bold">TO BE COMPLETED BY THE IMPARTIAL PHYSICIAN</p>
        <p className="mt-2">
          I have reviewed the names of the parties listed above and certify that I have no conflict of interest with respect to any party to this
          proceeding.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-10">
          <p className="border-t border-black pt-1">Physician Signature</p>
          <p className="border-t border-black pt-1">Date</p>
        </div>
      </div>
    </div>);

}