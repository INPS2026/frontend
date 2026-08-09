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
import {
  useAddHoliday,
  useUpdateHoliday,
} from '@/service/api/admin/config.api';
import { toast } from '../ui/toast';
import { isAxiosError } from 'axios';

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
  const addHoliday = useAddHoliday();
  const updateHoliday = useUpdateHoliday();

  const isPending = addHoliday.isPending || updateHoliday.isPending;

  const handleSubmit = async (values: HolidayFormOutput) => {
    try {
      if (mode === 'create') {
        await addHoliday.mutateAsync({ calendarId, ...values });
        toast.add({
          title: 'Added new holiday to calendar',
        });
        onOpenChange(false);
      } else {
        if (holiday === null || holiday === undefined) {
          throw new Error('Called update holiday without holiday Id');
        }

        await updateHoliday.mutateAsync({
          holidayId: holiday.id,
          data: values,
        });
        toast.add({
          title: 'Holiday updated successfully',
        });
        onOpenChange(false);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.add({
          title: `Failed to ${mode === 'create' ? 'Create' : 'Update'} holiday`,
          description: error.message,
        });
      }
      toast.add({
        title: (error as Error).message,
      });
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
