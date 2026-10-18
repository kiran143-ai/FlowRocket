import { Gender } from '../types/workspace';

/** Simulated life expectancy table (age, years remaining). The production table is maintained by the NYL Actuarial Group. */
export const lifeExpectancyTable: Record<Gender, [number, number][]> = {
  Female: [
  [20, 61.2], [30, 51.5], [40, 41.8], [45, 37.2], [50, 32.7], [55, 28.4], [60, 24.3],
  [65, 20.72], [70, 16.8], [75, 13.2], [80, 10.0], [85, 7.4], [90, 5.3], [95, 3.8], [100, 2.7]],

  Male: [
  [20, 57.6], [30, 48.2], [40, 38.5], [45, 34.0], [50, 29.6], [55, 25.4], [60, 21.4],
  [65, 17.9], [70, 14.6], [75, 11.5], [80, 8.7], [85, 6.4], [90, 4.6], [95, 3.3], [100, 2.4]]

};