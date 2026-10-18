import { lifeExpectancyTable } from '../data/lifeExpectancy';
import { Gender } from '../types/workspace';

export interface RatingResult {
  normalLE: number;
  normalLE75: number;
  estimatedLE: number;
  ratedAge: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function normalLifeExpectancy(age: number, gender: Gender): number {
  const table = lifeExpectancyTable[gender];
  if (age <= table[0][0]) return table[0][1];
  for (let i = 1; i < table.length; i += 1) {
    const [a1, le1] = table[i];
    const [a0, le0] = table[i - 1];
    if (age <= a1) return round2(le0 + (age - a0) / (a1 - a0) * (le1 - le0));
  }
  return table[table.length - 1][1];
}

export function calculateRating(age: number, gender: Gender, multPercent: number): RatingResult {
  const normalLE = normalLifeExpectancy(age, gender);
  const estimatedLE = round2(normalLE / (multPercent / 100));
  let ratedAge = age;
  while (ratedAge < 100 && normalLifeExpectancy(ratedAge, gender) > estimatedLE + 0.005) ratedAge += 1;
  return { normalLE, normalLE75: round2(normalLE * 0.75), estimatedLE, ratedAge };
}