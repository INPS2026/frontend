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
import { toast } from '@/components/ui/toast';
import { useRegisterStudent } from '@/service/api/admin/students.api';
import {
  NewStudentFormInput,
  NewStudentFormOutput,
  NewStudentSchema,
} from '@/types/student';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
} from 'react-hook-form';

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
                <FieldLabel htmlFor={field.name}>Sport house*</FieldLabel>
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
              <FieldLabel htmlFor={field.name}>Health info*</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Father Occupation*</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Mother Occupation*</FieldLabel>
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
            name="parentData.maritalStatus"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Marital*</FieldLabel>
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
    },
  });
  const registerStudent = useRegisterStudent();

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

  async function onSubmit(data: NewStudentFormOutput) {
    try {
      const res = await registerStudent.mutateAsync(data);
      toast.add({
        title: 'Registration complete',
        description: res.message,
      });
      form.reset();
      setCurrentStep(0);
    } catch (err) {
      if (isAxiosError(err)) {
        toast.add({
          title: 'Registration failed',
          description: err?.message,
        });
      } else {
        toast.add({
          title: 'Failed to register student',
        });
      }
    }
  }

  return (
    <div className="space-y-4">
      <TopBar title="Register new student" />

      <div className="bg-sidebar p-4">
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
                <Button key="next-btn" size="lg" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button
                  key="submit-btn"
                  type="submit"
                  form="register-student-form"
                >
                  Submit
                </Button>
              )}
            </div>
          </div>
        </FormProvider>
      </div>
    </div>
  );
}
