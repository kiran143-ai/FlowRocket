import { twMerge } from 'tailwind-merge';

/** Joins class names, dropping falsy values and resolving Tailwind conflicts. */
export const cn = (...classes: (string | false | null | undefined)[]) => twMerge(classes.filter(Boolean).join(' '));
