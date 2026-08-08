export const MAX_REQUEST_RETRIES = 3;

export const ROLES = [
  'TEACHER',
  'ADMIN',
  'HEAD_TEACHER',
  'BURSARY',
  'STOREKEEPER',
  'SUPPORT',
] as const;
export type RoleEnum = (typeof ROLES)[number];

export const GENDERS = ['MALE', 'FEMALE'] as const;
export type GenderEnum = (typeof GENDERS)[number];
