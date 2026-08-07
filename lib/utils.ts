import { clsx, type ClassValue } from 'clsx';
import { differenceInCalendarYears, getHours } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Calculates student age
export function calcAge(dateOfBirth: string) {
  return differenceInCalendarYears(Date.now(), dateOfBirth);
}

// Get time of day
export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening';

export function getTimeOfDay(date: Date = new Date()): TimeOfDay {
  const hour = getHours(date);

  if (hour >= 5 && hour < 12) {
    return 'Morning';
  }

  if (hour >= 12 && hour < 17) {
    return 'Afternoon';
  }

  return 'Evening';
}
