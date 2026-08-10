'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCreatePolicyConfiguration,
  useUpdatePolicyConfiguration,
} from '@/service/api/admin/policy.api';
import { Policy } from '@/types/policy';
import { formatTerm } from '@/lib/format';
import { TERMS } from '@/types/term';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { toast } from '../ui/toast';
import { isAxiosError } from 'axios';

const policyFormSchema = z.object({
  academicYear: z
    .string()
    .regex(/^\d{4}\/\d{4}$/, 'Academic year must be in the format YYYY/YYYY'),
  term: z.enum(TERMS, 'Term is required'),
  maxStudentsPerClass: z.coerce
    .number('Required')
    .int()
    .positive('Must be greater than 0'),
  minAverageScore: z.coerce.number('Required').min(0).max(100),
  minAttendancePercentage: z.coerce.number('Required').min(0).max(100),
  maxFailedSubjects: z.coerce.number('Required').int().min(0),
  passMark: z.coerce.number('Required').min(0).max(100),
  creditMark: z.coerce.number('Required').min(0).max(100),
  distinctionMark: z.coerce.number('Required').min(0).max(100),
});

export type PolicyFormInput = z.input<typeof policyFormSchema>;
export type PolicyFormOutput = z.output<typeof policyFormSchema>;

interface PolicyFormProps {
  formId: string;
  policy?: Policy;
  onSuccess: () => void;
}

export function PolicyForm({ formId, policy, onSuccess }: PolicyFormProps) {
  const isEditMode = !!policy;

  const form = useForm<PolicyFormInput, unknown, PolicyFormOutput>({
    resolver: zodResolver(policyFormSchema),
    defaultValues: {
      academicYear: policy?.academicYear ?? '',
      term: policy?.term ?? TERMS[0],
      maxStudentsPerClass: policy?.maxStudentsPerClass ?? 0,
      minAverageScore: policy?.minAverageScore ?? 0,
      minAttendancePercentage: policy?.minAttendancePercentage ?? 0,
      maxFailedSubjects: policy?.maxFailedSubjects ?? 0,
      passMark: policy?.passMark ?? 0,
      creditMark: policy?.creditMark ?? 0,
      distinctionMark: policy?.distinctionMark ?? 0,
    },
  });

  // Guard against stale defaultValues if `policy` arrives/changes after mount
  useEffect(() => {
    if (policy) {
      form.reset({
        academicYear: policy.academicYear,
        term: policy.term,
        maxStudentsPerClass: policy.maxStudentsPerClass,
        minAverageScore: policy.minAverageScore,
        minAttendancePercentage: policy.minAttendancePercentage,
        maxFailedSubjects: policy.maxFailedSubjects,
        passMark: policy.passMark,
        creditMark: policy.creditMark,
        distinctionMark: policy.distinctionMark,
      });
    }
  }, [policy, form]);

  const createPolicy = useCreatePolicyConfiguration();
  const updatePolicy = useUpdatePolicyConfiguration();

  const onSubmit = async (values: PolicyFormOutput) => {
    try {
      if (isEditMode) {
        await updatePolicy.mutateAsync({
          academicYear: policy.academicYear,
          term: policy.term,
          data: values,
        });
        toast.add({
          title: 'Policy updated successfully',
        });
      } else {
        await createPolicy.mutateAsync(values);
        toast.add({
          title: 'Policy created successfully',
        });
      }
      onSuccess();
      form.reset();
    } catch (error) {
      if (isAxiosError(error)) {
        toast.add({
          title: `Failed to ${isEditMode ? 'update' : 'create'} policy`,
          description: error.message,
        });
      }
    }
  };

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid grid-cols-2 gap-4"
    >
      <Controller
        control={form.control}
        name="academicYear"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Academic Year</FieldLabel>
            <Input
              placeholder="2025/2026"
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="term"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Term</FieldLabel>
            <Select
              name={field.name}
              value={field.value}
              onValueChange={(value) => {
                if (!value) return;
                field.onChange(value);
              }}
            >
              <SelectTrigger id={field.name}>
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                {TERMS.map((term) => (
                  <SelectItem key={term} value={term}>
                    {formatTerm(term)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="maxStudentsPerClass"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Max Students Per Class</FieldLabel>
            <Input
              type="number"
              {...field}
              id={field.name}
              value={field.value as number | string}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="minAverageScore"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Min Average Score</FieldLabel>
            <Input
              type="number"
              step="0.01"
              {...field}
              value={field.value as number | string}
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="minAttendancePercentage"
        render={({ field, fieldState }) => (
          <Field data-invalid>
            <FieldLabel htmlFor={field.name}>Min Attendance %</FieldLabel>
            <Input
              type="number"
              step="0.01"
              {...field}
              value={field.value as number | string}
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="maxFailedSubjects"
        render={({ field, fieldState }) => (
          <Field data-valid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Max Failed Subjects</FieldLabel>
            <Input
              type="number"
              {...field}
              id={field.name}
              value={field.value as number | string}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="passMark"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Pass Mark</FieldLabel>
            <Input
              type="number"
              step="0.01"
              {...field}
              value={field.value as number | string}
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="creditMark"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Credit Mark</FieldLabel>
            <Input
              type="number"
              step="0.01"
              {...field}
              value={field.value as number | string}
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="distinctionMark"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Distinction Mark</FieldLabel>
            <Input
              type="number"
              step="0.01"
              {...field}
              value={field.value as number | string}
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </form>
  );
}
