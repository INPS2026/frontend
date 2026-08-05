import z from 'zod';

export const SECTION_COLORS = ['YELLOW', 'BLUE', 'GREEN', 'RAINBOW'] as const;
export type SectionColor = (typeof SECTION_COLORS)[number];

export const NewSectionSchema = z.object({
  name: z.string().min(1, 'Section name is required'),
  roomNumber: z.coerce.number().nullable().optional(),
  color: z.enum(SECTION_COLORS),
});

export type NewSectionFormInput = z.input<typeof NewSectionSchema>;
export type NewSectionFormOutput = z.output<typeof NewSectionSchema>;

export type SectionTeacher = {
  staffId: string;
  firstName: string;
  lastName: string;
} | null;

export type Section = {
  id: string;
  name: string;
  classId: string;
  color: SectionColor | null;
  roomNumber: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  currentEnrollment: number;
  classTeacher: SectionTeacher;
  assistantTeacher: SectionTeacher;
};
