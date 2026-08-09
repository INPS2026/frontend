'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HolidayForm } from './holiday-form';
import type { HolidayFormOutput } from '@/lib/calendar-utils';
import type { Holiday } from '@/types/calendar';

const FORM_ID = 'holiday-form';

type HolidayFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calendarId: string;
  mode: 'create' | 'update';
  holiday?: Holiday | null; // required when mode === 'update'
};

export function HolidayFormDialog({
  open,
  onOpenChange,
  calendarId,
  mode,
  holiday,
}: HolidayFormDialogProps) {
  const isPending = false; // TODO: replace with mutation's isPending once wired

  const handleSubmit = (values: HolidayFormOutput) => {
    if (mode === 'create') {
      // TODO: call useCreateHoliday mutation with { calendarId, ...values }
      // On success: invalidate the calendar/holidays query, toast, then onOpenChange(false)
    } else {
      // TODO: call useUpdateHoliday mutation with { id: holiday.id, ...values }
      // On success: invalidate the calendar/holidays query, toast, then onOpenChange(false)
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add Holiday' : 'Edit Holiday'}
          </DialogTitle>
        </DialogHeader>

        <HolidayForm
          key={holiday?.id ?? 'create'}
          formId={FORM_ID}
          defaultValues={
            mode === 'update' && holiday
              ? {
                  name: holiday.name,
                  startDate: holiday.startDate,
                  endDate: holiday.endDate,
                  type: holiday.type,
                }
              : undefined
          }
          onSubmit={handleSubmit}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={isPending}>
            {isPending
              ? 'Saving...'
              : mode === 'create'
                ? 'Add Holiday'
                : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
