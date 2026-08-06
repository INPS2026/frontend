import z from 'zod';
import { ApiResponse } from './api';

export const STUDENT_SEX = ['MALE', 'FEMALE'] as const;
export type StudentSex = (typeof STUDENT_SEX)[number];

export const STUDENT_STATUS = ['ACTIVE', 'GRADUATED', 'WITHDRAWN'] as const;
export type StudentStatus = (typeof STUDENT_STATUS)[number];

export const INTAKE_TYPE = ['NEW', 'CONTINUING'] as const;
export type IntakeType = (typeof INTAKE_TYPE)[number];

const dateField = (message: string) =>
  z
    .string()
    .min(1, message)
    .transform((val) => new Date(val))
    .pipe(z.date());

export const NewStudentSchema = z
  .object({
    firstName: z.string().min(3, 'First name is too short'),
    lastName: z.string().min(3, 'Last name is too short'),
    gender: z.enum(STUDENT_SEX),
    dateOfBirth: dateField('Date of birth is required'),
    nationality: z.string().min(3, 'Nationality is too short'),
    state: z.string().min(3, 'State is too short'),
    lga: z.string().min(3, 'LGA is too short'),
    religion: z.enum(['christianity', 'islam', 'other']).optional(),
    healthInfo: z.string().min(3, 'Health information is too short'),
    sportHouse: z.string().min(3, 'Sport house is too short'),
    address: z.string().min(3, 'Address is too short'),
    intakeType: z.enum(INTAKE_TYPE, 'Intake type too short'),
    admissionDate: dateField('Admission date is required'),
    graduationDate: z
      .string()
      .transform((val) => (val ? new Date(val) : undefined))
      .pipe(z.date().optional())
      .optional(),
    accountEmail: z.email(),
    accountPhone: z.string().min(3, 'Enter a valid phone number'),
    parentData: z.object({
      fatherFirstName: z.string().min(3, 'Father first name is too short'),
      fatherLastName: z.string().min(3, 'Father last name is too short'),
      fatherOccupation: z.string().min(3, 'Father occupation is too short'),
      fatherEmail: z.email(),
      fatherPhone: z.string().min(3, 'Enter a valid phone number'),
      motherFirstName: z.string().min(3, 'Mother first name is too short'),
      motherLastName: z.string().min(3, 'Mother last name is too short'),
      motherOccupation: z.string().min(3, 'Mother occupation is too short'),
      motherEmail: z.email(),
      motherPhone: z.string().min(3, 'Enter a valid phone number'),
      address: z.string().min(10, 'Address is too short'),
      maritalStatus: z.enum(['single', 'divorced', 'married', 'other']),
    }),
    passportPhoto: z
      .file()
      .max(2 * 1024 * 1024, 'Photo must be under 2MB')
      .refine((f) => ['image/jpeg', 'image/png'].includes(f.type), {
        message: 'Photo must be a JPEG or PNG',
      })
      .optional(),
    admissionDocs: z
      .array(z.file().max(5 * 1024 * 1024, 'Each document must be under 5MB'))
      .max(10, 'You can upload up to 10 documents')
      .optional(),
  })
  .refine(
    (data) => !data.graduationDate || data.graduationDate > data.admissionDate,
    {
      message: 'Graduation date must be after admission date',
      path: ['graduationDate'],
    },
  )
  .refine(
    (data) => {
      if (!data.admissionDate || !data.dateOfBirth) {
        return true;
      }

      const age =
        (data.admissionDate.getTime() - data.dateOfBirth.getTime()) /
        (1000 * 60 * 60 * 24 * 365.25);
      return age >= 2 && age <= 25;
    },
    {
      message: 'Date of birth does not match a valid student age at admission',
      path: ['dateOfBirth'],
    },
  );

export type Student = {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  gender: StudentSex;
  dateOfBirth: string;
  nationality: string;
  state: string;
  lga: string;
  religion: string;
  healthInfo: string;
  sportHouse: string;
  address: string;
  status: StudentStatus;
  intakeType: IntakeType;
  passportPhoto: null;
  admissionDocs: null;
  biometricId: null;
  admissionDate: string;
  graduationDate: null;
  createdAt: string;
  updatedAt: string;
  enrollments: Record<string, unknown>[];
};

export type NewStudentFormInput = z.input<typeof NewStudentSchema>;
export type NewStudentFormOutput = z.output<typeof NewStudentSchema>;

export type RegisterStudentResponse = ApiResponse<Student>;
export type GetStudentsResponse = ApiResponse<Student[]>;
export type GetChildrenResponse = ApiResponse<
  Pick<
    Student,
    | 'id'
    | 'admissionNumber'
    | 'firstName'
    | 'lastName'
    | 'gender'
    | 'dateOfBirth'
    | 'passportPhoto'
    | 'status'
    | 'enrollments'
  >[]
>;
export type GetChildProfileResponse = ApiResponse<Student>;
export type GetStudentByAdmissionNoResponse = ApiResponse<{
  admissionNumber: string;
  firstName: string;
  lastName: string;
  gender: StudentSex;
  status: StudentStatus;
  parent: {
    accountEmail: string;
    accountPhone: string;
  };
}>;
