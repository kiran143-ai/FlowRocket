export interface Swatch {
  token: string;
  hex: string;
  usage: string;
  onDark?: boolean;
}

export const colorGroups: {name: string;description: string;swatches: Swatch[];}[] = [
{
  name: 'Brand blue',
  description: 'Derived from the existing FlowRocket header blue. 600–700 carry white text at AA; 700 is the link color on white.',
  swatches: [
  { token: 'brand-50', hex: '#EFF6FC', usage: 'Row hover, info surfaces' },
  { token: 'brand-100', hex: '#DCEBF8', usage: 'Selected chips' },
  { token: 'brand-200', hex: '#B9D7F0', usage: 'Info borders' },
  { token: 'brand-500', hex: '#2F82C7', usage: 'Focus ring, icons', onDark: true },
  { token: 'brand-600', hex: '#2369A8', usage: 'Top bar, primary button', onDark: true },
  { token: 'brand-700', hex: '#1D5689', usage: 'Workspace bar, links', onDark: true },
  { token: 'brand-800', hex: '#1A476F', usage: 'Window titles, pressed', onDark: true }]

},
{
  name: 'Ink neutrals',
  description: 'Cool neutrals for text, borders and surfaces. ink-500 is the lightest color allowed for body text.',
  swatches: [
  { token: 'canvas', hex: '#F3F6F9', usage: 'App background' },
  { token: 'ink-50', hex: '#F5F7FA', usage: 'Table headers, toolbars' },
  { token: 'ink-200', hex: '#D9E0E7', usage: 'Borders, dividers' },
  { token: 'ink-400', hex: '#8494A4', usage: 'Placeholder, disabled icons', onDark: true },
  { token: 'ink-500', hex: '#5A6B7C', usage: 'Secondary text (5.4:1)', onDark: true },
  { token: 'ink-700', hex: '#3A4A5A', usage: 'Labels, headers', onDark: true },
  { token: 'ink-900', hex: '#1B2733', usage: 'Primary text (15.6:1)', onDark: true }]

},
{
  name: 'Semantic',
  description: 'Status meaning is always paired with a label or icon, never color alone.',
  swatches: [
  { token: 'success-700', hex: '#17703E', usage: 'Timeline header, success text', onDark: true },
  { token: 'success-50', hex: '#ECF8F1', usage: 'Success surface, new row' },
  { token: 'warning-500', hex: '#E89B0C', usage: 'Rework flag, Summary header' },
  { token: 'warning-700', hex: '#8F5A00', usage: 'Warning text, Estimated L.E.', onDark: true },
  { token: 'danger-600', hex: '#C42B2B', usage: 'Rush flag, rated age, destructive', onDark: true },
  { token: 'danger-50', hex: '#FDEFEF', usage: 'Error surface' }]

}];


export const typeScale: {name: string;spec: string;className: string;sample: string;usage: string;}[] = [
{ name: 'Page title', spec: '24 / 32 · Semibold · −1.5%', className: 'text-2xl font-semibold tracking-tight', sample: 'Good morning, Lauren', usage: 'Home Workspace, Reports h1' },
{ name: 'Case title', spec: '18 / 28 · Semibold', className: 'text-lg font-semibold', sample: 'Rating Activity for SHEILA STUART', usage: 'Case header h1' },
{ name: 'Panel title', spec: '15 / 22 · Semibold', className: 'text-[15px] font-semibold', sample: 'My Underwriter Work Queue', usage: 'Panel & window titles' },
{ name: 'Section title', spec: '14 / 20 · Semibold', className: 'text-sm font-semibold', sample: 'Impairment Codes', usage: 'Sub-sections in forms' },
{ name: 'Body', spec: '14 / 20 · Regular', className: 'text-sm', sample: 'I am requesting a rated age for the following claimant.', usage: 'Email body, inputs' },
{ name: 'Table / Label', spec: '13 / 18 · Regular–Medium', className: 'text-[13px] font-medium', sample: 'KELSEY TAYLOR (ktaylor@branthickey.com)', usage: 'Table cells, field labels' },
{ name: 'Caption', spec: '12 / 16 · Medium', className: 'text-xs font-medium', sample: 'by Stacey Angoy on Apr 01, 2026', usage: 'Column headers, meta' },
{ name: 'Metric', spec: '32 / 32 · Semibold · Tabular', className: 'text-[32px] font-semibold leading-none tracking-tight tabular-nums', sample: '20.72', usage: 'Stat cards, rating values' },
{ name: 'Eyebrow', spec: '11 / 16 · Semibold · Caps +5%', className: 'text-[11px] font-semibold uppercase tracking-wider text-ink-500', sample: 'Step 3 · Confirm', usage: 'Card steps, column headers' }];


export const spacingScale: {token: string;px: number;usage: string;}[] = [
{ token: '1', px: 4, usage: 'Icon-to-text gap in badges' },
{ token: '2', px: 8, usage: 'Control groups, chip gaps' },
{ token: '3', px: 12, usage: 'Field stacks, toolbar padding' },
{ token: '4', px: 16, usage: 'Panel padding, mobile gutter' },
{ token: '5', px: 20, usage: 'Gap between dashboard panels' },
{ token: '6', px: 24, usage: 'Desktop page gutter' },
{ token: '8', px: 32, usage: 'Column gap in rating form' }];


export const a11yGuidelines: {criterion: string;guidance: string;}[] = [
{ criterion: '1.4.3 Contrast (Minimum)', guidance: 'Body text uses ink-900 / ink-700 / ink-500 on white (≥ 5.4:1). White text appears only on brand-600 or darker, success-700 and danger-600.' },
{ criterion: '1.4.11 Non-text Contrast', guidance: 'Input borders and focus rings reach ≥ 3:1. Status badges pair a dot with a text label.' },
{ criterion: '1.4.1 Use of Color', guidance: 'Rush and Rework flags sit in labeled columns and carry screen-reader text. Validation errors pair an icon with a message.' },
{ criterion: '2.4.7 / 2.4.11 Focus Visible & Not Obscured', guidance: 'Every interactive element shows a 2px brand-500 ring with a 2px offset. The sticky form footer never covers the focused field.' },
{ criterion: '2.5.8 Target Size (Minimum)', guidance: 'Icon buttons are at least 28×28px (24px minimum), with 4px spacing in toolbars.' },
{ criterion: '2.1.1 Keyboard', guidance: 'Tabs support arrow, Home and End keys. Dialogs trap focus, close on Esc and return focus to the trigger. Recipient chips accept Enter and Backspace.' },
{ criterion: '3.3.1 / 3.3.3 Error Identification & Suggestion', guidance: 'Errors are announced inline with aria-describedby and say how to fix the problem, for example “Use the format MM/DD/YYYY.”' },
{ criterion: '4.1.2 Name, Role, Value', guidance: 'Icon-only controls have aria-labels. Sortable headers expose aria-sort. Pagination uses aria-current.' },
{ criterion: '2.3.3 Animation from Interactions', guidance: 'Motion is limited to transitions of 300ms or less. prefers-reduced-motion turns them off.' }];


export const flaggedChanges: {title: string;detail: string;}[] = [
{ title: 'Trash requires confirmation and offers Undo', detail: 'In the original, Trash removes an inbox email in one click. The prototype adds a confirmation dialog and an Undo toast to prevent accidental loss. Please confirm this behavior change.' },
{ title: 'Send / Cancel actions on My Wall and Add Message', detail: 'The source screenshots are cropped above the action row. The prototype adds Send and Cancel buttons. Please confirm the original labels and placement.' },
{ title: 'Case toolbar destinations', detail: 'The Home, list, medical (1), folder (2, 4), team (3) and chat icons have no documented targets. The prototype maps them to the closest existing screens.' },
{ title: 'Claimant search “Next »” requires a selected result', detail: 'The original behavior isn’t documented. The prototype enables Next only after you select an existing claimant row.' },
{ title: 'Attachment dropdown shown as Download', detail: 'The original chevron menu next to each PDF is shown as a labeled Download button. Please confirm whether the menu had other actions.' },
{ title: 'Inbox Status column', detail: 'The Status column is blank in every source screenshot. It now shows an em dash so empty cells read as intentional. Possible values need to be defined.' },
{ title: 'Design System link in the workspace bar', detail: 'Added for prototype review only. Remove it before production.' }];