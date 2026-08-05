'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import { useCreateSection } from '@/service/api/admin/sections.api';
import { useState } from 'react';
import {
  NewSectionFormInput,
  NewSectionFormOutput,
  NewSectionSchema,
  SECTION_COLORS,
} from '@/types/section';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type AddSectionDialogProps = {
  classroomId: string;
};

export function AddSectionDialog({ classroomId }: AddSectionDialogProps) {
  const [open, setOpen] = useState(false);
  const createSection = useCreateSection();

  const form = useForm<NewSectionFormInput, unknown, NewSectionFormOutput>({
    resolver: zodResolver(NewSectionSchema),
    defaultValues: {
      name: '',
      roomNumber: undefined,
      color: 'YELLOW',
    },
  });

  const onSubmit = async (data: NewSectionFormOutput) => {
    try {
      await createSection.mutateAsync({ classroomId, data });
      toast.add({ title: 'Section created successfully' });
      form.reset();
      setOpen(false);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.add({
          title: 'Failed to create section',
          description: error.message,
        });
        return;
      }
      toast.add({ title: 'Something went wrong while creating the section' });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) form.reset();
      }}
    >
      <DialogTrigger
        render={
          <Button size="sm">
            <Plus className="size-4" />
            Add Section
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Section</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Section name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="roomNumber"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Room number</FieldLabel>
                <Input
                  {...field}
                  value={(field.value as unknown as string) ?? ''}
                  type="number"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="color"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Color</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTION_COLORS.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          <Button type="submit" className="w-full">
            <Plus className="size-4" />
            Create Section
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
