export const TERMS = ['FIRST_TERM', 'SECOND_TERM', 'THIRD_TERM'] as const;
export type Term = (typeof TERMS)[number];
