'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Term } from '@/types/term';
import { Field, FieldError, FieldLabel } from '../ui/field';

const updateTermDatesSchema = z
  .object({
    startDate: z.date('Start date is required'),
    endDate: z.date('End date is required'),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

type UpdateTermDatesValues = z.infer<typeof updateTermDatesSchema>;

export function UpdateTermDatesDialog({
  term,
  open,
  onOpenChange,
}: {
  term: Term;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<UpdateTermDatesValues>({
    resolver: zodResolver(updateTermDatesSchema),
    defaultValues: {
      startDate: new Date(term.startDate),
      endDate: new Date(term.endDate),
    },
  });

  useEffect(() => {
    form.reset({
      startDate: new Date(term.startDate),
      endDate: new Date(term.endDate),
    });
  }, [term.startDate, term.endDate, form]);

  // TODO: wire up useUpdateTermDates mutation
  const onSubmit = async (values: UpdateTermDatesValues) => {
    console.log('update term dates', term.id, values);
    // await updateTermDates({ id: term.id, ...values }, { onSuccess: () => setOpen(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Term Dates</DialogTitle>
        </DialogHeader>
        <form
          id={`update-term-dates-form-${term.id}`}
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-3"
        >
          <Controller
            control={form.control}
            name="startDate"
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex flex-col"
              >
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
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(field.value, 'PP')
                          : 'Pick a date'}
                      </Button>
                    }
                  />
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="endDate"
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex flex-col"
              >
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
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(field.value, 'PP')
                          : 'Pick a date'}
                      </Button>
                    }
                  />
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form={`update-term-dates-form-${term.id}`}
            disabled={form.formState.isSubmitting}
          >
            Save Dates
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
