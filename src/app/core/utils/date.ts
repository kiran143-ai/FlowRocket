/** Prototype reference date — matches the case activity in the client screenshots. */
export const REFERENCE_DATE = new Date(2026, 3, 1);

export function parseUSDate(value: string): Date | null {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const month = Number(match[1]) - 1;
  const date = new Date(Number(match[3]), month, Number(match[2]));
  if (date.getMonth() !== month || date.getDate() !== Number(match[2])) return null;
  return date;
}

export function formatUSDate(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${mm}/${dd}/${date.getFullYear()}`;
}

export function ageParts(dob: Date, ref: Date = REFERENCE_DATE): {years: number;months: number;} {
  let years = ref.getFullYear() - dob.getFullYear();
  let months = ref.getMonth() - dob.getMonth();
  if (ref.getDate() < dob.getDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months };
}

/** Age nearest birthday, as used for rating. */
export function nearestAge(dob: Date, ref: Date = REFERENCE_DATE): number {
  const { years, months } = ageParts(dob, ref);
  return months >= 6 ? years + 1 : years;
}