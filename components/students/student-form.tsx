'use client';

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
import { cn } from '@/lib/utils';
import {
  NewStudentFormInput,
  NewStudentFormOutput,
  NewStudentSchema,
  type Student,
} from '@/types/student';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form';

type StudentFormMode = 'create' | 'update';

interface StudentFormProps {
  mode?: StudentFormMode;
  initialValues?: Partial<NewStudentFormInput>;
  onSubmit?: (
    data: NewStudentFormOutput,
    changedValues?: Partial<NewStudentFormOutput>,
  ) => void | Promise<void>;
  submitLabel?: string;
}

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

export const createStudentFormDefaults = (): NewStudentFormInput => ({
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: 'MALE',
  nationality: '',
  state: '',
  lga: '',
  religion: 'other',
  address: '',
  intakeType: 'NEW',
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
});

const formatDateValue = (value: unknown): string => {
  if (typeof value === 'string') {
    return value.slice(0, 10);
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return '';
};

export const mapStudentToFormValues = (
  student: Student,
): NewStudentFormInput => ({
  firstName: student.firstName ?? '',
  lastName: student.lastName ?? '',
  dateOfBirth: formatDateValue(student.dateOfBirth),
  gender: student.gender ?? 'MALE',
  nationality: student.nationality ?? '',
  state: student.state ?? '',
  lga: student.lga ?? '',
  religion: (student.religion as NewStudentFormInput['religion']) ?? 'other',
  address: student.address ?? '',
  intakeType: student.intakeType ?? 'NEW',
  admissionDate: formatDateValue(student.admissionDate),
  graduationDate: formatDateValue(student.graduationDate),
  sportHouse: student.sportHouse ?? '',
  healthInfo: student.healthInfo ?? '',
  accountEmail: student.parent?.accountEmail ?? '',
  accountPhone: student.parent?.accountPhone ?? '',
  parentData: {
    fatherFirstName: student.parent?.fatherFirstName ?? '',
    fatherLastName: student.parent?.fatherLastName ?? '',
    fatherEmail: student.parent?.fatherEmail ?? '',
    fatherPhone: student.parent?.fatherPhone ?? '',
    fatherOccupation: student.parent?.fatherOccupation ?? '',
    motherFirstName: student.parent?.motherFirstName ?? '',
    motherLastName: student.parent?.motherLastName ?? '',
    motherEmail: student.parent?.motherEmail ?? '',
    motherPhone: student.parent?.motherPhone ?? '',
    motherOccupation: student.parent?.motherOccupation ?? '',
    address: student.parent?.address ?? '',
    maritalStatus:
      (student.parent
        ?.maritalStatus as NewStudentFormInput['parentData']['maritalStatus']) ??
      'other',
  },
});

const normalizeValue = (value: unknown): unknown => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof File) {
    return {
      name: value.name,
      size: value.size,
      type: value.type,
    };
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeValue(item));
  }

  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).reduce(
      (acc, [key, nestedValue]) => {
        acc[key] = normalizeValue(nestedValue);
        return acc;
      },
      {} as Record<string, unknown>,
    );
  }

  return value;
};

const collectChangedValues = (
  current: unknown,
  baseline: unknown,
  parentPath = '',
): Record<string, unknown> => {
  if (
    current &&
    typeof current === 'object' &&
    !Array.isArray(current) &&
    !(current instanceof File) &&
    !(current instanceof Date) &&
    baseline &&
    typeof baseline === 'object' &&
    !Array.isArray(baseline) &&
    !(baseline instanceof File) &&
    !(baseline instanceof Date)
  ) {
    const changedValues: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(
      current as Record<string, unknown>,
    )) {
      const nestedPath = parentPath ? `${parentPath}.${key}` : key;
      const nestedDiff = collectChangedValues(
        value,
        (baseline as Record<string, unknown>)[key],
        nestedPath,
      );

      Object.assign(changedValues, nestedDiff);
    }

    return changedValues;
  }

  if (normalizeValue(current) !== normalizeValue(baseline)) {
    return parentPath ? { [parentPath]: current } : {};
  }

  return {};
};

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
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
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
                <FieldLabel htmlFor={field.name}>Nationality*</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>State*</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>LGA*</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Address*</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Sport House*</FieldLabel>
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
              <FieldLabel htmlFor={field.name}>Health information*</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Account email*</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="email"
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
                <FieldLabel htmlFor={field.name}>Account phone*</FieldLabel>
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
            name="admissionDate"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Admission date*</FieldLabel>
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
            name="graduationDate"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Graduation date</FieldLabel>
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
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="intakeType"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Intake type*</FieldLabel>
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
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="CONTINUING">Continuing</SelectItem>
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
                <FieldLabel htmlFor={field.name}>Father first name*</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Father last name*</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Father email*</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="email"
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
                <FieldLabel htmlFor={field.name}>Father phone*</FieldLabel>
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
      <FieldGroup>
        <h2 className="font-semibold">Mother Information</h2>
        <div className="grid grid-cols-2 gap-2">
          <Controller
            control={form.control}
            name="parentData.motherFirstName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Mother first name*</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Mother last name*</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Mother email*</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="email"
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
                <FieldLabel htmlFor={field.name}>Mother phone*</FieldLabel>
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
      <FieldGroup>
        <h2 className="font-semibold">General Information</h2>
        <div className="grid grid-cols-2 gap-2">
          <Controller
            control={form.control}
            name="parentData.fatherOccupation"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Father occupation*</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Mother occupation*</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Parent address*</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Marital status*</FieldLabel>
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
              <FieldLabel htmlFor="passportPhoto">Passport photo</FieldLabel>
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
              {passportPhoto && (
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{passportPhoto.name}</span>
                  <Button type="button" variant="ghost" size="icon">
                    <Trash className="size-4" />
                  </Button>
                </div>
              )}
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
              <FieldLabel htmlFor="admissionDocs">
                Admission documents
              </FieldLabel>
              <Input
                id="admissionDocs"
                type="file"
                multiple
                name={name}
                ref={ref}
                disabled={disabled}
                onBlur={onBlur}
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  onChange(files);
                }}
                aria-invalid={!!fieldState.error}
              />
              {admissionDocs.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {admissionDocs.map((file, index) => (
                    <li key={`${file.name}-${index}`}>{file.name}</li>
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

export function StudentForm({
  mode = 'create',
  initialValues,
  onSubmit,
  submitLabel = mode === 'update' ? 'Save changes' : 'Submit',
}: StudentFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const form = useForm<NewStudentFormInput, unknown, NewStudentFormOutput>({
    resolver: zodResolver(NewStudentSchema),
    defaultValues: useMemo(
      () => ({
        ...createStudentFormDefaults(),
        ...(initialValues ?? {}),
      }),
      [initialValues],
    ),
  });

  useEffect(() => {
    if (mode === 'update') {
      form.reset({
        ...createStudentFormDefaults(),
        ...(initialValues ?? {}),
      });
    }
  }, [form, initialValues, mode]);

  const handleNext = async () => {
    const fieldsToValidate = steps[currentStep].fields;
    const isValid = await form.trigger(fieldsToValidate as never);

    if (isValid) {
      setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const handleFormSubmit = async (data: NewStudentFormOutput) => {
    if (mode === 'update' && initialValues) {
      const changedValues = collectChangedValues(data, {
        ...createStudentFormDefaults(),
        ...(initialValues ?? {}),
      });

      await onSubmit?.(data, changedValues);
      return;
    }

    await onSubmit?.(data);
  };

  return (
    <div className={cn('space-y-4', mode === 'create' && 'mx-auto max-w-2xl')}>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          {mode === 'create' ? (
            <>
              {currentStep === 0 && <StudentInfo />}
              {currentStep === 1 && <AdmissionInfo />}
              {currentStep === 2 && <ParentInfo />}
              {currentStep === 3 && <Documents />}
            </>
          ) : (
            <div className="space-y-4">
              <StudentInfo />
              <AdmissionInfo />
              <ParentInfo />
              <Documents />
            </div>
          )}

          {mode === 'create' ? (
            <div className="flex justify-end gap-2">
              <Button
                size="lg"
                variant="outline"
                disabled={currentStep === 0}
                onClick={handleBack}
                type="button"
              >
                Previous
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button
                  key="next-btn"
                  size="lg"
                  type="button"
                  onClick={handleNext}
                >
                  Next
                </Button>
              ) : (
                <Button key="submit-btn" size="lg" type="submit">
                  Submit
                </Button>
              )}
            </div>
          ) : (
            <div className="flex justify-end gap-2">
              <Button type="submit" size="lg">
                {submitLabel}
              </Button>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
}
