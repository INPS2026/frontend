import { TermEnum } from '@/types/term';
import { format } from 'date-fns';

// Format date - Default 'dd MMM yyyy' e.g. 15 Mar 2000
export function formatDate(date: string, formatString?: string) {
  return format(date, formatString ?? 'dd MMM yyyy');
}

export function formatTerm(term: TermEnum) {
  return term
    .split('_')
    .map((word) => word[0] + word.slice(1).toLowerCase())
    .join(' ');
}
