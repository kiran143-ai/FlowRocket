import { jsPDF } from 'jspdf';
import { impairmentCodes } from '../data/impairmentCodes';
import { CaseRecord } from '../types/case';
import { raFileName } from './raSheet';

type RGB = [number, number, number];

// Mirrors tailwind.config.js so the PDF matches the on-screen sheet.
const C = {
  brand50: [239, 246, 252] as RGB,
  brand200: [185, 215, 240] as RGB,
  brand600: [35, 105, 168] as RGB,
  brand800: [26, 71, 111] as RGB,
  ink100: [236, 240, 244] as RGB,
  ink200: [217, 224, 231] as RGB,
  ink500: [90, 107, 124] as RGB,
  ink900: [27, 39, 51] as RGB,
  danger600: [196, 43, 43] as RGB,
  warning50: [255, 247, 232] as RGB,
  warning700: [143, 90, 0] as RGB,
  white: [255, 255, 255] as RGB
};

/** Rows shared by the on-screen sheet and the PDF so both stay in sync. */
export function raSheetContent(c: CaseRecord) {
  const r = c.rating;
  return {
    claimant: [
    ['Claimant', c.claimantName],
    ['Case #', c.caseNumber],
    ['Date of birth', c.dob],
    ['Gender', c.gender]] as
    [string, string][],
    broker: [
    ['Agency', c.broker.firm],
    ['City', c.broker.city],
    ['Contact', c.broker.contact]] as
    [string, string][],
    details: r ?
    [
    ['Date evaluated', r.dateEvaluated],
    ['Response date', r.responseDate],
    ['Valid through', r.expirationDate],
    ['Mortality method', `${r.multMethod} · ${r.mult}%`],
    ['75% Normal L.E.', `${r.normalLE75.toFixed(2)} yrs`],
    ['Primary impairment', impairmentCodes.find((i) => i.code === r.primaryImpairmentCode)?.label.replace(/ - .*$/, '') ?? '—']] as
    [string, string][] :
    []
  };
}

export function downloadRASheet(c: CaseRecord) {
  const r = c.rating;
  if (!r) return;
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const W = 612;
  const M = 48;
  const content = raSheetContent(c);

  const fill = (rgb: RGB) => doc.setFillColor(...rgb);
  const stroke = (rgb: RGB) => doc.setDrawColor(...rgb);
  const text = (rgb: RGB, size: number, weight: 'normal' | 'bold' = 'normal') => {
    doc.setTextColor(...rgb);
    doc.setFontSize(size);
    doc.setFont('helvetica', weight);
  };

  // Header band
  fill(C.brand800);
  doc.rect(0, 0, W, 96, 'F');
  fill(C.white);
  doc.roundedRect(M, 24, 48, 48, 4, 4, 'F');
  text(C.brand800, 9, 'bold');
  ['NEW', 'YORK', 'LIFE'].forEach((t, i) => doc.text(t, M + 24, 41 + i * 10, { align: 'center' }));
  text(C.white, 20, 'bold');
  doc.text('Rated Age Confirmation', M + 64, 46);
  text(C.brand200, 10);
  doc.text('New York Life Insurance Company · Structured Settlements Medical Underwriting', M + 64, 64);
  text(C.white, 10, 'bold');
  doc.text(`Case # ${c.caseNumber}`, W - M, 46, { align: 'right' });
  text(C.brand200, 9);
  doc.text(`Issued ${r.responseDate}`, W - M, 62, { align: 'right' });

  // Hero: rated age
  let y = 124;
  fill(C.brand50);
  stroke(C.brand200);
  doc.roundedRect(M, y, W - 2 * M, 96, 6, 6, 'FD');
  text(C.ink500, 9, 'bold');
  doc.text('FINAL RATED AGE', M + 20, y + 26);
  text(C.danger600, 44, 'bold');
  doc.text(String(r.finalRatedAge), M + 20, y + 72);
  stroke(C.brand200);
  doc.line(M + 150, y + 18, M + 150, y + 78);
  const stats: [string, string][] = [
  ['Actual age', String(r.age)],
  ['Years rated up', `+${r.finalRatedAge - r.age}`],
  ['Normal L.E.', `${r.normalLE.toFixed(2)} yrs`],
  ['Estimated L.E.', `${r.estimatedLE.toFixed(2)} yrs`]];

  const colW = (W - 2 * M - 170) / 4;
  stats.forEach(([k, v], i) => {
    const x = M + 170 + i * colW;
    text(C.ink500, 9);
    doc.text(k, x, y + 40);
    text(C.ink900, 16, 'bold');
    doc.text(v, x, y + 62);
  });

  // Two cards: claimant and broker
  y += 120;
  const cardW = (W - 2 * M - 16) / 2;
  const card = (x: number, title: string, rows: [string, string][]) => {
    stroke(C.ink200);
    fill(C.white);
    doc.roundedRect(x, y, cardW, 118, 6, 6, 'FD');
    text(C.brand600, 9, 'bold');
    doc.text(title.toUpperCase(), x + 16, y + 22);
    let rowY = y + 46;
    rows.forEach(([k, v]) => {
      text(C.ink500, 10);
      doc.text(k, x + 16, rowY);
      text(C.ink900, 10, 'bold');
      const lines: string[] = doc.splitTextToSize(v, cardW - 116);
      doc.text(lines, x + 100, rowY, { lineHeightFactor: 1.3 });
      rowY += 18 + (lines.length - 1) * 13;
    });
  };
  card(M, 'Claimant', content.claimant);
  card(M + cardW + 16, 'Broker', content.broker);

  // Rating details table
  y += 142;
  text(C.brand600, 9, 'bold');
  doc.text('RATING DETAILS', M, y);
  y += 10;
  content.details.forEach(([k, v], i) => {
    const rowY = y + i * 26;
    if (i % 2 === 0) {
      fill([248, 250, 252]);
      doc.rect(M, rowY, W - 2 * M, 26, 'F');
    }
    text(C.ink500, 10);
    doc.text(k, M + 12, rowY + 17);
    text(C.ink900, 10, 'bold');
    doc.text(v, W - M - 12, rowY + 17, { align: 'right' });
  });
  y += content.details.length * 26;
  stroke(C.ink200);
  doc.line(M, y, W - M, y);

  // Validity callout
  y += 22;
  fill(C.warning50);
  doc.roundedRect(M, y, W - 2 * M, 40, 4, 4, 'F');
  text(C.warning700, 10, 'bold');
  doc.text(`This rated age is valid through ${r.expirationDate}.`, M + 14, y + 17);
  text(C.warning700, 9);
  doc.text('After this date, request a new rating with updated medical records.', M + 14, y + 31);

  // Underwriter sign-off
  y += 72;
  text(C.ink500, 9, 'bold');
  doc.text('UNDERWRITER', M, y);
  text(C.ink900, 13, 'bold');
  doc.text(c.underwriter.name, M, y + 20);
  text(C.ink500, 10);
  doc.text(`${c.underwriter.email}  ·  ${c.underwriter.phone}`, M, y + 36);

  // Footer
  stroke(C.ink200);
  doc.line(M, 740, W - M, 740);
  text(C.ink500, 8);
  doc.text('Confidential — contains protected health information intended only for the named broker.', M, 756);
  doc.text(`${raFileName(c)}  ·  Page 1 of 1`, W - M, 756, { align: 'right' });

  doc.save(raFileName(c));
}
