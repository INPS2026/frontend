'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { Field, FieldError, FieldLabel } from '../ui/field';

const createSessionSchema = z.object({
  session: z.string().min(1, 'Session name is required'),
});

type CreateSessionValues = z.infer<typeof createSessionSchema>;

export function CreateSessionDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateSessionValues>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: { session: '' },
  });

  // TODO: wire up useCreateAcademicSession mutation
  const onSubmit = async (values: CreateSessionValues) => {
    console.log('create session', values);
    // await createSession(values, { onSuccess: () => { form.reset(); setOpen(false); } });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            Create Session
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Academic Session</DialogTitle>
        </DialogHeader>
        <form
          id="create-session-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Controller
            control={form.control}
            name="session"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Session Name</FieldLabel>
                <Input
                  placeholder="e.g. 2025/2026"
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
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form="create-session-form"
            disabled={form.formState.isSubmitting}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
