export const MAX_REQUEST_RETRIES = 3;

export const CLASSROOM_LEVELS = [
  'DAYCARE',
  'PRENURSERY',
  'NURSERY_1',
  'NURSERY_2',
  'NURSERY_3',
  'PRIMARY_1',
  'PRIMARY_2',
  'PRIMARY_3',
  'PRIMARY_4',
  'PRIMARY_5',
  'PRIMARY_6',
] as const;

export type ClassroomLevel = (typeof CLASSROOM_LEVELS)[number];
