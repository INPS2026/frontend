'use client';

import { useState } from 'react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { formatTerm } from '@/lib/format';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { TERMS } from '@/types/term';

// TODO: replace with real TermEnum / TermStatus values from your types
const TERM_OPTIONS = ['FIRST_TERM', 'SECOND_TERM', 'THIRD_TERM'] as const;
const TERM_STATUS_OPTIONS = ['UPCOMING', 'ACTIVE', 'COMPLETED'] as const;

const addTermSchema = z
  .object({
    term: z.enum(TERM_OPTIONS),
    status: z.enum(TERM_STATUS_OPTIONS),
    startDate: z.date('Start date is required'),
    endDate: z.date('End date is required'),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

type AddTermValues = z.infer<typeof addTermSchema>;

export function AddTermDialog({
  sessionId,
  trigger,
}: {
  sessionId: string;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<AddTermValues>({
    resolver: zodResolver(addTermSchema),
  });

  // TODO: wire up useCreateTerm mutation
  const onSubmit = async (values: AddTermValues) => {
    console.log('add term', sessionId, values);
    // await createTerm({ sessionId, ...values }, { onSuccess: () => { form.reset(); setOpen(false); } });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Term</DialogTitle>
        </DialogHeader>
        <form
          id={`add-term-form-${sessionId}`}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Controller
            control={form.control}
            name="term"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Term</FieldLabel>
                <Select
                  name={field.name}
                  onValueChange={(value) => {
                    if (!value) return;
                    field.onChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Select a term" />
                  </SelectTrigger>
                  <SelectContent>
                    {TERMS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {formatTerm(t)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="status"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                <Select
                  name={field.name}
                  onValueChange={(value) => {
                    if (!value) return;
                    field.onChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {TERM_STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
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
                      id={field.name}
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
                      id={field.name}
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
          </div>
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form={`add-term-form-${sessionId}`}
            disabled={form.formState.isSubmitting}
          >
            Add Term
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
