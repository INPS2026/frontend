'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type Term, type TermStatus } from '@/types/term';
import { Field, FieldError, FieldLabel } from '../ui/field';

const TERM_STATUS_OPTIONS: TermStatus[] = ['CURRENT', 'UPCOMING', 'COMPLETED'];

const updateTermStatusSchema = z.object({
  status: z.enum([
    'CURRENT',
    'UPCOMING',
    'COMPLETED',
  ] as const) satisfies z.ZodType<TermStatus>,
});

type UpdateTermStatusValues = z.infer<typeof updateTermStatusSchema>;

export function UpdateTermStatusDialog({
  term,
  open,
  onOpenChange,
}: {
  term: Term;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // const

  const form = useForm<UpdateTermStatusValues>({
    resolver: zodResolver(updateTermStatusSchema),
    defaultValues: { status: term.status },
  });

  useEffect(() => {
    form.reset({ status: term.status });
  }, [term.status, form]);

  // TODO: wire up useUpdateTermStatus mutation
  const onSubmit = async (values: UpdateTermStatusValues) => {
    console.log('update term status', term.id, values);
    // await updateTermStatus({ id: term.id, ...values }, { onSuccess: () => setOpen(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Term Status</DialogTitle>
        </DialogHeader>
        <form
          id={`update-term-status-form-${term.id}`}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
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
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form={`update-term-status-form-${term.id}`}
            disabled={form.formState.isSubmitting}
          >
            Save Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
