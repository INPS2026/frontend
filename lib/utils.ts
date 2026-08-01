import { clsx, type ClassValue } from 'clsx';
import { differenceInCalendarYears } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calcAge(dateOfBirth: string) {
  return differenceInCalendarYears(Date.now(), dateOfBirth);
}
