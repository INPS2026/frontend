'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  AnnouncementCategory,
  Communication,
  CommunicationStatus,
  CommunicationTarget,
  CommunicationType,
} from '@/types/communication';

const communicationFormSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    type: z.enum(CommunicationType, 'Type is required'),
    target: z.enum(CommunicationTarget, 'Target is required'),
    announcementCategory: z.enum(AnnouncementCategory).nullable(),
    status: z.enum(CommunicationStatus, 'Status is required'),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'ANNOUNCEMENT' && !data.announcementCategory) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Category is required for announcements',
        path: ['announcementCategory'],
      });
    }
  });

export type CommunicationFormValues = z.infer<typeof communicationFormSchema>;

type CommunicationFormProps = {
  formId: string;
  defaultValues?: Communication | null;
  onSubmit: (values: CommunicationFormValues) => void;
};

export function CommunicationForm({
  formId,
  defaultValues,
  onSubmit,
}: CommunicationFormProps) {
  const form = useForm<CommunicationFormValues>({
    resolver: zodResolver(communicationFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      content: defaultValues?.content ?? '',
      type: defaultValues?.type ?? 'ANNOUNCEMENT',
      target: defaultValues?.target ?? 'ALL',
      announcementCategory: defaultValues?.announcementCategory ?? null,
      status: defaultValues?.status ?? 'DRAFT',
    },
  });

  // Reset guard: defaultValues are captured once at mount, so re-sync
  // explicitly whenever the fetched entity changes (e.g. on edit).
  useEffect(() => {
    if (defaultValues) {
      form.reset({
        title: defaultValues.title,
        content: defaultValues.content,
        type: defaultValues.type,
        target: defaultValues.target,
        announcementCategory: defaultValues.announcementCategory,
        status: defaultValues.status,
      });
    }
  }, [defaultValues, form]);

  const type = form.watch('type');

  return (
    <form
      id={formId}
      className="space-y-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...form.register('title')} />
        {form.formState.errors.title && (
          <p className="text-sm text-destructive">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" rows={5} {...form.register('content')} />
        {form.formState.errors.content && (
          <p className="text-sm text-destructive">
            {form.formState.errors.content.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={form.watch('type')}
            onValueChange={(value) => {
              if (!value) return;
              form.setValue('type', value as CommunicationFormValues['type'], {
                shouldValidate: true,
              });
              // Clear category when switching away from ANNOUNCEMENT
              if (value !== 'ANNOUNCEMENT') {
                form.setValue('announcementCategory', null, {
                  shouldValidate: true,
                });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {CommunicationType.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.type && (
            <p className="text-sm text-destructive">
              {form.formState.errors.type.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Target</Label>
          <Select
            value={form.watch('target')}
            onValueChange={(value) => {
              if (!value) return;
              form.setValue(
                'target',
                value as CommunicationFormValues['target'],
                { shouldValidate: true },
              );
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select target" />
            </SelectTrigger>
            <SelectContent>
              {CommunicationTarget.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.target && (
            <p className="text-sm text-destructive">
              {form.formState.errors.target.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {type === 'ANNOUNCEMENT' && (
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={form.watch('announcementCategory') ?? undefined}
              onValueChange={(value) => {
                form.setValue(
                  'announcementCategory',
                  (value as CommunicationFormValues['announcementCategory']) ??
                    null,
                  { shouldValidate: true },
                );
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {AnnouncementCategory.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.announcementCategory && (
              <p className="text-sm text-destructive">
                {form.formState.errors.announcementCategory.message}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={form.watch('status')}
            onValueChange={(value) => {
              if (!value) return;
              form.setValue(
                'status',
                value as CommunicationFormValues['status'],
                { shouldValidate: true },
              );
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {CommunicationStatus.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.status && (
            <p className="text-sm text-destructive">
              {form.formState.errors.status.message}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
