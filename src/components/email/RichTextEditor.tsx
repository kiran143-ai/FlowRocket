import React, { useEffect, useRef } from 'react';
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  UnderlineIcon } from
'lucide-react';
import { twMerge } from 'tailwind-merge';

interface RichTextEditorProps {
  id: string;
  label: string;
  hideLabel?: boolean;
  initialHtml?: string;
  minHeight?: number;
  onChange?: (text: string) => void;
  error?: string;
}

const tools = [
{ cmd: 'bold', label: 'Bold', icon: BoldIcon },
{ cmd: 'italic', label: 'Italic', icon: ItalicIcon },
{ cmd: 'underline', label: 'Underline', icon: UnderlineIcon },
{ cmd: 'justifyLeft', label: 'Align left', icon: AlignLeftIcon },
{ cmd: 'justifyCenter', label: 'Align center', icon: AlignCenterIcon },
{ cmd: 'justifyRight', label: 'Align right', icon: AlignRightIcon },
{ cmd: 'justifyFull', label: 'Justify', icon: AlignJustifyIcon },
{ cmd: 'insertUnorderedList', label: 'Bulleted list', icon: ListIcon },
{ cmd: 'insertOrderedList', label: 'Numbered list', icon: ListOrderedIcon }];


const selectCls = 'focus-ring h-7 rounded border border-ink-200 bg-white px-1.5 text-xs text-ink-700 hover:border-ink-300';

export function RichTextEditor({ id, label, hideLabel = false, initialHtml, minHeight = 160, onChange, error }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const initial = useRef(initialHtml);

  useEffect(() => {
    if (ref.current && initial.current) ref.current.innerHTML = initial.current;
  }, []);

  const exec = (cmd: string, value?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, value);
    onChange?.(ref.current?.innerText ?? '');
  };

  const onSelect = (cmd: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) exec(cmd, e.target.value);
    e.target.value = '';
  };

  return (
    <div>
      <span id={`${id}-label`} className={hideLabel ? 'sr-only' : 'mb-1.5 block text-[13px] font-medium text-ink-700'}>
        {label}
      </span>
      <div
        className={twMerge(
          'overflow-hidden rounded-md border bg-white transition-[border-color,box-shadow] duration-150 focus-within:ring-2',
          error ? 'border-danger-500 focus-within:ring-danger-500/25' : 'border-ink-200 focus-within:border-brand-500 focus-within:ring-brand-500/25'
        )}>
        
        <div role="toolbar" aria-label={`${label} formatting`} className="flex flex-wrap items-center gap-0.5 border-b border-ink-100 bg-ink-50 px-1.5 py-1">
          {tools.map(({ cmd, label: l, icon: Icon }, i) =>
          <React.Fragment key={cmd}>
              {(i === 3 || i === 7) && <span className="mx-1 h-5 w-px bg-ink-200" aria-hidden="true" />}
              <button
              type="button"
              aria-label={l}
              title={l}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec(cmd)}
              className="focus-ring grid h-7 w-7 place-items-center rounded text-ink-700 transition-colors duration-150 hover:bg-white hover:text-ink-900">
              
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </React.Fragment>
          )}
          <span className="mx-1 h-5 w-px bg-ink-200" aria-hidden="true" />
          <select aria-label="Font Size" className={selectCls} defaultValue="" onChange={onSelect('fontSize')}>
            <option value="">Font Size</option>
            <option value="2">Small</option>
            <option value="3">Normal</option>
            <option value="5">Large</option>
          </select>
          <select aria-label="Font Family" className={selectCls} defaultValue="" onChange={onSelect('fontName')}>
            <option value="">Font Family</option>
            <option value="Inter">Inter</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
          </select>
          <select aria-label="Font Format" className={selectCls} defaultValue="" onChange={onSelect('formatBlock')}>
            <option value="">Font Format</option>
            <option value="<p>">Paragraph</option>
            <option value="<h3>">Heading</option>
            <option value="<pre>">Preformatted</option>
          </select>
        </div>
        <div
          ref={ref}
          id={id}
          role="textbox"
          aria-multiline="true"
          aria-labelledby={`${id}-label`}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => onChange?.(e.currentTarget.innerText)}
          style={{ minHeight }}
          className="max-h-[420px] overflow-y-auto px-3 py-2.5 text-sm leading-6 text-ink-900 focus:outline-none [&_h3]:font-semibold [&_hr]:my-3 [&_hr]:border-ink-200 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5" />
        
      </div>
      {error &&
      <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-danger-700">
          {error}
        </p>
      }
    </div>);

}