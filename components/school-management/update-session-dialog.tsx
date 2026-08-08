'use client';

import { useEffect, useState } from 'react';
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
import { Field, FieldError, FieldLabel } from '../ui/field';
import { GetAllAcademicSessionsResponse } from '@/types/config';
import { useUpdateAcademicSession } from '@/service/api/admin/config.api';
import { toast } from '../ui/toast';
import { isAxiosError } from 'axios';

type Session = Awaited<GetAllAcademicSessionsResponse>['data'][number];

const updateSessionSchema = z.object({
  session: z.string().min(1, 'Session name is required'),
});

type UpdateSessionValues = z.infer<typeof updateSessionSchema>;

export function UpdateSessionDialog({
  session,
  trigger,
}: {
  session: Session;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const updateSession = useUpdateAcademicSession();

  const form = useForm<UpdateSessionValues>({
    resolver: zodResolver(updateSessionSchema),
    defaultValues: { session: session.session },
  });

  // keep in sync if session data changes while dialog is closed
  useEffect(() => {
    form.reset({ session: session.session });
  }, [session, form]);

  const onSubmit = async (values: UpdateSessionValues) => {
    try {
      await updateSession.mutateAsync({ id: session.id, data: values });
      toast.add({
        title: 'Session updated successfully',
        description: `Session ${values.session} has been updated successfully.`,
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      if (isAxiosError(error)) {
        toast.add({
          title: 'Failed to update session',
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
          <DialogTitle>Update Academic Session</DialogTitle>
        </DialogHeader>
        <form
          id={`update-session-form-${session.id}`}
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
            form={`update-session-form-${session.id}`}
            disabled={updateSession.isPending}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
