import type { ThemeId } from '../services/theme.service';

export interface Swatch {
  token: string;
  hex: string;
  usage: string;
  onDark?: boolean;
}

export interface ColorGroup {
  name: string;
  description: string;
  swatches: Swatch[];
}

const classicColorGroups: ColorGroup[] = [
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


const evergreenColorGroups: ColorGroup[] = [
{
  name: 'Brand green',
  description: 'A deep teal-green for the Evergreen version. 600–900 carry white text at AA; 700 is the link color on white and 900 is the sidebar.',
  swatches: [
  { token: 'brand-50', hex: '#E2F0EE', usage: 'Row hover, selected rows' },
  { token: 'brand-100', hex: '#CBE5E1', usage: 'Selected chips' },
  { token: 'brand-200', hex: '#A5D2CC', usage: 'Info borders' },
  { token: 'brand-500', hex: '#1A8179', usage: 'Focus ring, icons', onDark: true },
  { token: 'brand-600', hex: '#0F6B66', usage: 'Primary button, active tab', onDark: true },
  { token: 'brand-700', hex: '#0B5753', usage: 'Links, pressed', onDark: true },
  { token: 'brand-800', hex: '#0A4A47', usage: 'Window titles', onDark: true },
  { token: 'brand-900', hex: '#0B2A2C', usage: 'Sidebar, avatars', onDark: true }]

},
{
  name: 'Ink neutrals',
  description: 'Green-tinted neutrals for text, borders and surfaces. ink-400 is the lightest color allowed for any text, including placeholders.',
  swatches: [
  { token: 'canvas', hex: '#F3F5F4', usage: 'App background' },
  { token: 'ink-50', hex: '#F5F7F6', usage: 'Table headers, toolbars' },
  { token: 'ink-200', hex: '#DCE2E0', usage: 'Borders, dividers' },
  { token: 'ink-400', hex: '#66736F', usage: 'Placeholder, disabled icons (4.9:1)', onDark: true },
  { token: 'ink-500', hex: '#55625E', usage: 'Secondary text (6.4:1)', onDark: true },
  { token: 'ink-700', hex: '#3D4B49', usage: 'Labels, headers', onDark: true },
  { token: 'ink-900', hex: '#14201F', usage: 'Primary text (16.7:1)', onDark: true }]

},
{
  name: 'Semantic',
  description: 'Status meaning is always paired with a label or icon, never color alone. info is used for “Ready for UW” and replied states.',
  swatches: [
  { token: 'success-700', hex: '#1F6038', usage: 'Success text, Sent to broker', onDark: true },
  { token: 'success-50', hex: '#E4F2E9', usage: 'Success surface' },
  { token: 'warning-600', hex: '#996515', usage: 'Warning icons, avatars', onDark: true },
  { token: 'warning-700', hex: '#7E5310', usage: 'Warning text', onDark: true },
  { token: 'warning-50', hex: '#FBF1DE', usage: 'Needs-action surface' },
  { token: 'danger-600', hex: '#B4323A', usage: 'Rush flag, rated age, destructive', onDark: true },
  { token: 'danger-50', hex: '#FBE9EA', usage: 'Error surface' },
  { token: 'info-700', hex: '#2D4684', usage: 'Informational status', onDark: true },
  { token: 'info-50', hex: '#E8EDF8', usage: 'Informational surface' }]

}];

export const evergreenBlueColorGroups: ColorGroup[] = [
{
  name: 'Brand blue',
  description: 'Corporate Blue palette for the Evergreen layout. Primary deep blue #005C92 carries white text at AA (7.1:1) and is also the sidebar surface; Accent Sky #03A1FF marks the active sidebar item; brand-500 is the focus ring and accent.',
  swatches: [
  { token: 'brand-50', hex: '#E8F2FA', usage: 'Row hover, selected rows' },
  { token: 'brand-100', hex: '#CFE4F3', usage: 'Selected chips' },
  { token: 'brand-200', hex: '#A4CAE8', usage: 'Info borders' },
  { token: 'brand-500', hex: '#1081C5', usage: 'Focus ring, accents, icons', onDark: true },
  { token: 'brand-600', hex: '#005C92', usage: 'Primary button, active tab, sidebar surface', onDark: true },
  { token: 'brand-700', hex: '#004A78', usage: 'Links, pressed', onDark: true },
  { token: 'brand-800', hex: '#003A60', usage: 'Window titles', onDark: true },
  { token: 'brand-900', hex: '#082642', usage: 'Avatars, active-row text, marker', onDark: true },
  { token: 'accent-sky', hex: '#03A1FF', usage: 'Sidebar active row (navy text, 5.5:1); not used for white text', onDark: false }]

},
{
  name: 'Neutrals',
  description: 'Cool grays for text, borders and surfaces on an #EEEEEE canvas. ink-400 is the lightest color allowed for any text.',
  swatches: [
  { token: 'canvas', hex: '#EEEEEE', usage: 'App background' },
  { token: 'ink-50', hex: '#F5F6F8', usage: 'Table headers, toolbars' },
  { token: 'ink-200', hex: '#DEE2E6', usage: 'Borders, dividers' },
  { token: 'ink-400', hex: '#5A626A', usage: 'Placeholder, muted text (6.2:1 on white, 5.3:1 on canvas)', onDark: true },
  { token: 'ink-500', hex: '#495057', usage: 'Secondary text', onDark: true },
  { token: 'ink-700', hex: '#343A40', usage: 'Labels, headers', onDark: true },
  { token: 'ink-900', hex: '#212529', usage: 'Body text', onDark: true }]

},
{
  name: 'Status & action',
  description: 'Status meaning is always paired with a label or icon. Bright success and warning hues are used as fills; darker steps carry text.',
  swatches: [
  { token: 'success-600', hex: '#1E7E34', usage: 'Success text, Sent to broker', onDark: true },
  { token: 'success-500', hex: '#28A745', usage: 'Success marker' },
  { token: 'warning-500', hex: '#FFC107', usage: 'Warning fill, nav marker' },
  { token: 'warning-600', hex: '#856404', usage: 'Warning text', onDark: true },
  { token: 'danger-500', hex: '#DC3545', usage: 'Danger, Delete, Clear', onDark: true },
  { token: 'danger-600', hex: '#C82837', usage: 'Rush flag, errors', onDark: true },
  { token: 'info-700', hex: '#004A78', usage: 'Informational status', onDark: true },
  { token: 'info-50', hex: '#E8F2FA', usage: 'Informational surface' }]

}];

export interface ThemeDoc {
  name: string;
  colorGroups: ColorGroup[];
  font: { name: string; credit: string; stack: string; mono?: string };
  radii: [string, string, string][];
  elevation: string;
  navigation: string;
}

export const themeDocs: Record<ThemeId, ThemeDoc> = {
  classic: {
    name: 'Classic',
    colorGroups: classicColorGroups,
    font: { name: 'Inter', credit: 'Designed by Rasmus Andersson for screen interfaces · SIL Open Font License', stack: 'Inter, ui-sans-serif, system-ui, sans-serif' },
    radii: [['rounded', '4px', 'Chips, toolbar buttons'], ['rounded-md', '6px', 'Inputs, buttons'], ['rounded-lg', '8px', 'Panels, cards'], ['rounded-xl', '12px', 'Dialogs']],
    elevation: 'Radii stay small to keep the enterprise density, and shadows are limited to one hairline level plus one overlay level.',
    navigation: 'The original two-tier blue header and per-record window bar are kept. Tone and spacing are refined, and every icon has a label.'
  },
  evergreen: {
    name: 'Evergreen',
    colorGroups: evergreenColorGroups,
    font: { name: 'IBM Plex Sans', credit: 'Designed by Mike Abbink at IBM · SIL Open Font License', stack: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif", mono: "'IBM Plex Mono' for case numbers and identifiers" },
    radii: [['rounded', '4px', 'Chips, toolbar buttons'], ['rounded-md', '6px', 'Inputs, buttons'], ['rounded-lg', '8px', 'Panels, cards'], ['rounded-xl', '10px', 'Cards, dialogs']],
    elevation: 'Surfaces are flat: a 1px border does the work of a shadow. Only dialogs and floating menus lift off the page.',
    navigation: 'A deep-teal sidebar replaces the two-tier header. Case screens gain a workspace header with the claimant identity, key figures and tabbed case navigation.'
  }
};

export interface ThemeComparison {
  area: string;
  classic: string;
  evergreen: string;
}

export const themeComparison: ThemeComparison[] = [
{ area: 'Navigation', classic: 'Two-tier blue header with workspace bar', evergreen: 'Collapsible deep-teal sidebar with a slim top bar' },
{ area: 'Home Workspace', classic: 'Four step cards, then stacked work queue, inbox and review tables', evergreen: 'Pipeline strip, tabbed work lists, and a rail with the inbox and rush / rework cases' },
{ area: 'Email review', classic: 'Claimant search beside the email', evergreen: 'Three columns: inbox list, email reader, claimant search' },
{ area: 'Case screens', classic: 'Window bar, title row and icon toolbar', evergreen: 'Workspace header with identity and figures, tabbed navigation, and a case progress rail' },
{ area: 'Typography', classic: 'Inter', evergreen: 'IBM Plex Sans, with IBM Plex Mono for identifiers' },
{ area: 'Shape & elevation', classic: 'Soft cards with raised shadows', evergreen: 'Flat, hairline-bordered surfaces' }];


export const themeTokens: { token: string; classic: string; evergreen: string; usage: string }[] = [
{ token: '--brand-600', classic: '#2369A8', evergreen: '#0F6B66', usage: 'Primary buttons, active tabs, header' },
{ token: '--brand-900', classic: '#163B5C', evergreen: '#0B2A2C', usage: 'Deepest brand tone (Evergreen sidebar)' },
{ token: '--canvas', classic: '#F3F6F9', evergreen: '#F3F5F4', usage: 'App background' },
{ token: '--ink-900', classic: '#1B2733', evergreen: '#14201F', usage: 'Primary text' },
{ token: '--radius-xl', classic: '12px', evergreen: '10px', usage: 'Cards and dialogs' },
{ token: '--shadow-raised', classic: 'soft two-layer', evergreen: '1px hairline', usage: 'Panels and cards' },
{ token: '--font-sans', classic: 'Inter', evergreen: 'IBM Plex Sans', usage: 'All interface text' }];


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