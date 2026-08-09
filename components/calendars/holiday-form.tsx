'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  HOLIDAY_TYPES,
  HOLIDAY_TYPE_STYLES,
  holidayFormSchema,
  type HolidayFormInput,
  type HolidayFormOutput,
} from '@/lib/calendar-utils';
import { Field, FieldError, FieldLabel } from '../ui/field';

type HolidayFormProps = {
  formId: string;
  defaultValues?: Partial<HolidayFormInput>;
  onSubmit: (values: HolidayFormOutput) => void;
};

export function HolidayForm({
  formId,
  defaultValues,
  onSubmit,
}: HolidayFormProps) {
  const form = useForm<HolidayFormInput, unknown, HolidayFormOutput>({
    resolver: zodResolver(holidayFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      startDate: defaultValues?.startDate ?? '',
      endDate: defaultValues?.endDate ?? '',
      type: defaultValues?.type ?? 'PUBLIC',
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
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Holiday Name</FieldLabel>
            <Input
              placeholder="e.g. Christmas Break"
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
        name="type"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Type</FieldLabel>
            <Select
              name={field.name}
              value={field.value}
              onValueChange={(value) => {
                if (!value) return; // Base UI Select: value can be null
                field.onChange(value);
              }}
            >
              <SelectTrigger id={field.name}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {HOLIDAY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {HOLIDAY_TYPE_STYLES[type].label}
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
              <FieldLabel htmlFor={field.name}>Start Date</FieldLabel>
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
