'use client';

import { TopBar } from '@/components/top-bar';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
} from 'react-hook-form';
import z from 'zod';

const optionalNonEmptyString = (message: string) =>
  z
    .string()
    .optional()
    .refine((val) => !val || val.trim().length >= 1, { message });

const dateField = (message: string) =>
  z
    .string()
    .min(1, message)
    .transform((val) => new Date(val))
    .pipe(z.date());

const NewStudentSchema = z
  .object({
    firstName: z.string().min(3, 'First name is too short'),
    lastName: z.string().min(3, 'Last name is too short'),
    gender: z.enum(['male', 'female', 'other']),
    dateOfBirth: dateField('Date of birth is required'),
    nationality: optionalNonEmptyString('Nationality is too short'),
    state: optionalNonEmptyString('State is too short'),
    lga: optionalNonEmptyString('LGA is too short'),
    religion: z.enum(['christianity', 'islam', 'other']).optional(),
    healthInfo: optionalNonEmptyString('Health information is too short'),
    sportHouse: optionalNonEmptyString('Sport house is too short'),
    address: optionalNonEmptyString('Address is too short'),
    intakeType: optionalNonEmptyString('Intake type too short'),
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

type NewStudentFormInput = z.input<typeof NewStudentSchema>;
type NewStudentFormOutput = z.output<typeof NewStudentSchema>;

const steps = [
  {
    title: 'Student Info',
    fields: [
      'firstName',
      'lastName',
      'gender',
      'dateOfBirth',
      'nationality',
      'state',
      'lga',
      'religion',
      'healthInfo',
      'sportHouse',
      'address',
    ],
  },
  {
    title: 'Admission Info',
    fields: [
      'intakeType',
      'admissionDate',
      'graduationDate',
      'accountEmail',
      'accountPhone',
    ],
  },
  {
    title: 'Parent/Guardian Info',
    fields: [
      'parentData.fatherFirstName',
      'parentData.fatherLastName',
      'parentData.fatherOccupation',
      'parentData.fatherEmail',
      'parentData.fatherPhone',
      'parentData.motherFirstName',
      'parentData.motherLastName',
      'parentData.motherOccupation',
      'parentData.motherEmail',
      'parentData.motherPhone',
      'parentData.address',
      'parentData.maritalStatus',
    ],
  },
  {
    title: 'Documents',
    fields: ['passportPhoto', 'admissionDocs'],
  },
] as const satisfies {
  title: string;
  fields: (keyof NewStudentFormInput | `parentData.${string}`)[];
}[];

const StudentInfo = () => {
  const form = useFormContext<
    NewStudentFormInput,
    unknown,
    NewStudentFormOutput
  >();

  return (
    <FieldSet>
      <FieldLegend>Student information</FieldLegend>
      <FieldDescription>Fill required student information</FieldDescription>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="firstName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>First name*</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="lastName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Last name*</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="dateOfBirth"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Date of Birth*</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="date"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="gender"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Gender*</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="nationality"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Nationality</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="state"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>State</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="lga"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>LGA</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="religion"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Religion</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="christianity">Christianity</SelectItem>
                    <SelectItem value="islam">Islam</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="address"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="sportHouse"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Sport house</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <Controller
          control={form.control}
          name="healthInfo"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Health info</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                className="min-h-30"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </FieldSet>
  );
};

const AdmissionInfo = () => {
  const form = useFormContext<
    NewStudentFormInput,
    unknown,
    NewStudentFormOutput
  >();

  return (
    <FieldSet>
      <FieldLegend>Admission information</FieldLegend>
      <FieldDescription>Fill required student information</FieldDescription>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="accountEmail"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Account Email*</FieldLabel>
                <Input
                  {...field}
                  type="email"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="accountPhone"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Account Phone*</FieldLabel>
                <Input
                  {...field}
                  type="tel"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="admissionDate"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Admission date*</FieldLabel>
                <Input
                  {...field}
                  type="date"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="graduationDate"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Graduation date</FieldLabel>
                <Input
                  {...field}
                  type="date"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="intakeType"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Intake type</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </FieldGroup>
    </FieldSet>
  );
};

const ParentInfo = () => {
  const form = useFormContext<
    NewStudentFormInput,
    unknown,
    NewStudentFormOutput
  >();

  return (
    <FieldSet>
      <FieldLegend>Parent/Guardian Information</FieldLegend>
      <FieldDescription>Fill required student information</FieldDescription>
      <FieldGroup>
        <h2 className="font-semibold">Father Information</h2>

        <div className="grid grid-cols-2 gap-2">
          <Controller
            control={form.control}
            name="parentData.fatherFirstName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>First name*</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="parentData.fatherLastName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Last name*</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Controller
            control={form.control}
            name="parentData.fatherEmail"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email*</FieldLabel>
                <Input
                  {...field}
                  type="email"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="parentData.fatherPhone"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Phone*</FieldLabel>
                <Input
                  {...field}
                  type="tel"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </FieldGroup>
      <FieldGroup>
        <h2 className="font-semibold">Mother Information</h2>

        <div className="grid grid-cols-2 gap-2">
          <Controller
            control={form.control}
            name="parentData.motherFirstName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>First name*</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="parentData.motherLastName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Last name*</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Controller
            control={form.control}
            name="parentData.motherEmail"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email*</FieldLabel>
                <Input
                  {...field}
                  type="email"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="parentData.motherPhone"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Phone*</FieldLabel>
                <Input
                  {...field}
                  type="tel"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </FieldGroup>
      <FieldGroup>
        <h2 className="font-semibold">General Information</h2>

        <div className="grid grid-cols-2 gap-2">
          <Controller
            control={form.control}
            name="parentData.fatherOccupation"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Father Occupation</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="parentData.motherOccupation"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Mother Occupation</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Controller
            control={form.control}
            name="parentData.address"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="parentData.maritalStatus"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Marital</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </FieldGroup>
    </FieldSet>
  );
};

const Documents = () => {
  const form = useFormContext<
    NewStudentFormInput,
    unknown,
    NewStudentFormOutput
  >();

  const passportPhoto = form.watch('passportPhoto');
  const admissionDocs = form.watch('admissionDocs') ?? [];

  return (
    <FieldSet>
      <FieldLegend>Documents</FieldLegend>
      <FieldDescription>Upload all necessary documents</FieldDescription>
      <FieldGroup>
        <Controller
          control={form.control}
          name="passportPhoto"
          render={({
            field: { onChange, onBlur, name, ref, disabled },
            fieldState,
          }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={name}>Student passport</FieldLabel>
              <Input
                id="passportPhoto"
                type="file"
                accept="image/jpeg,image/png"
                name={name}
                ref={ref}
                disabled={disabled}
                onBlur={onBlur}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  onChange(file);
                }}
                aria-invalid={fieldState.invalid}
              />
              {passportPhoto && <p>Selected: {passportPhoto.name}</p>}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="admissionDocs"
          render={({
            field: { onChange, onBlur, name, ref, disabled },
            fieldState,
          }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                id="admissionDocs"
                type="file"
                multiple
                name={name}
                ref={ref}
                disabled={disabled}
                onBlur={onBlur}
                onChange={(e) => {
                  const files = e.target.files
                    ? Array.from(e.target.files)
                    : [];
                  onChange(files);
                }}
                aria-invalid={!!fieldState.error}
              />
              {admissionDocs.length > 0 && (
                <ul>
                  {admissionDocs.map((file, index) => (
                    <li
                      key={`${file.name}-${file.lastModified}-${index}`}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <span>{file.name}</span>
                        <span>{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          const updated = admissionDocs.filter(
                            (_, i) => i !== index,
                          );
                          form.setValue('admissionDocs', updated, {
                            shouldValidate: true,
                          });
                        }}
                      >
                        <Trash />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </FieldSet>
  );
};

export default function RegisterNewStudentPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const form = useForm<NewStudentFormInput, unknown, NewStudentFormOutput>({
    resolver: zodResolver(NewStudentSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'other',
      nationality: '',
      state: '',
      lga: '',
      religion: 'other',
      address: '',
      intakeType: '',
      admissionDate: '',
      graduationDate: '',
      sportHouse: '',
      healthInfo: '',
      accountEmail: '',
      accountPhone: '',
      parentData: {
        fatherFirstName: '',
        fatherLastName: '',
        fatherEmail: '',
        fatherPhone: '',
        fatherOccupation: '',
        motherFirstName: '',
        motherLastName: '',
        motherEmail: '',
        motherPhone: '',
        motherOccupation: '',
        address: '',
        maritalStatus: 'other',
      },
    },
  });

  const handleNext = async () => {
    const fieldsToValidate = steps[currentStep].fields;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isValid = await form.trigger(fieldsToValidate as any);

    if (isValid) {
      setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  function onSubmit(data: NewStudentFormOutput) {
    console.log(data);
  }

  return (
    <div className="space-y-4">
      <TopBar title="Register new student" />

      <div className="">
        <div className="bg-sidebar p-4 shadow-sm">
          <FormProvider {...form}>
            <div className="max-w-2xl mx-auto space-y-4">
              <form
                id="register-student-form"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {currentStep === 0 && <StudentInfo />}
                {currentStep === 1 && <AdmissionInfo />}
                {currentStep === 2 && <ParentInfo />}
                {currentStep === 3 && <Documents />}
              </form>
              <div className="flex justify-end gap-2">
                <Button
                  size="lg"
                  variant="outline"
                  disabled={currentStep === 0}
                  onClick={handleBack}
                >
                  Previous
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button size="lg" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" form="register-student-form">
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
