'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarWidget } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
  CalendarFormInput,
  CalendarFormOutput,
  calendarFormSchema,
} from '@/lib/calendar-utils';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { getAcademicYearOptions } from '@/lib/academic-year';
import { TERMS } from '@/types/term';
import { formatTerm } from '@/lib/format';

type CalendarFormProps = {
  formId: string;
  defaultValues?: Partial<CalendarFormInput>;
  onSubmit: (values: CalendarFormOutput) => void;
};

export function CalendarForm({
  formId,
  defaultValues,
  onSubmit,
}: CalendarFormProps) {
  const academicYearOptions = getAcademicYearOptions();

  const form = useForm<CalendarFormInput, unknown, CalendarFormOutput>({
    resolver: zodResolver(calendarFormSchema),
    defaultValues: {
      academicYear: defaultValues?.academicYear ?? '',
      term: defaultValues?.term ?? 'FIRST_TERM',
      startDate: defaultValues?.startDate ?? '',
      endDate: defaultValues?.endDate ?? '',
    },
  });

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <Controller
        control={form.control}
        name="academicYear"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Academic Year</FieldLabel>
            <Select
              name={field.name}
              value={field.value}
              onValueChange={(value) => {
                if (!value) return; // Base UI Select: value can be null
                field.onChange(value);
              }}
            >
              <SelectTrigger id={field.name}>
                <SelectValue placeholder="Select academic year" />
              </SelectTrigger>
              <SelectContent>
                {academicYearOptions.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
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

      <div className="grid grid-cols-2 gap-4">
        <Controller
          control={form.control}
          name="startDate"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex flex-col">
              <FieldLabel>Start Date</FieldLabel>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      className={cn(
                        'justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {field.value
                        ? format(parseISO(field.value), 'PP')
                        : 'Pick a date'}
                    </Button>
                  }
                />
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarWidget
                    mode="single"
                    selected={field.value ? parseISO(field.value) : undefined}
                    onSelect={(date) => {
                      if (!date) return;
                      field.onChange(format(date, 'yyyy-MM-dd'));
                    }}
                  />
                </PopoverContent>
              </Popover>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="endDate"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex flex-col">
              <FieldLabel htmlFor={field.name}>End Date</FieldLabel>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      className={cn(
                        'justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {field.value
                        ? format(parseISO(field.value), 'PP')
                        : 'Pick a date'}
                    </Button>
                  }
                />
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarWidget
                    mode="single"
                    selected={field.value ? parseISO(field.value) : undefined}
                    onSelect={(date) => {
                      if (!date) return;
                      field.onChange(format(date, 'yyyy-MM-dd'));
                    }}
                  />
                </PopoverContent>
              </Popover>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </form>
  );
}
