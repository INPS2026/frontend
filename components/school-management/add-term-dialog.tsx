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
import {
  AddTermInput,
  AddTermOutput,
  addTermSchema,
  TERMS,
} from '@/types/term';
import { useCreateTerm } from '@/service/api/admin/config.api';
import { toast } from '../ui/toast';
import { isAxiosError } from 'axios';

export function AddTermDialog({
  sessionId,
  trigger,
}: {
  sessionId: string;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const createTerm = useCreateTerm();

  const form = useForm<AddTermInput, unknown, AddTermOutput>({
    resolver: zodResolver(addTermSchema),
  });

  const onSubmit = async (values: AddTermInput) => {
    try {
      await createTerm.mutateAsync({ ...values, sessionId });
      toast.add({
        title: 'Term added successfully',
        description: `Term ${formatTerm(values.term)} has been added successfully.`,
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      if (isAxiosError(error)) {
        toast.add({
          title: 'Failed to add term',
          description: error.message,
        });
      }
    }
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
            disabled={createTerm.isPending}
          >
            Add Term
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
