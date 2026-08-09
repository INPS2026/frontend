'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUpdateSchoolCalendar } from '@/service/api/admin/config.api';
import { CalendarForm } from './calendar-form';
import type { Calendar } from '@/types/calendar';
import { CalendarFormOutput } from '@/lib/calendar-utils';
import { toast } from '../ui/toast';
import { isAxiosError } from 'axios';

const FORM_ID = 'update-calendar-form';

type UpdateCalendarDialogProps = {
  calendar: Calendar | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UpdateCalendarDialog({
  calendar,
  open,
  onOpenChange,
}: UpdateCalendarDialogProps) {
  const updateCalendar = useUpdateSchoolCalendar();

  if (!calendar) return null;

  const handleSubmit = async (values: CalendarFormOutput) => {
    try {
      await updateCalendar.mutateAsync({
        calendarId: calendar.id,
        data: values,
      });
      toast.add({
        title: 'Calendar updated successfully',
      });
      onOpenChange(false);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.add({
          title: 'Failed to update calendar',
          description: error.message,
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Calendar</DialogTitle>
        </DialogHeader>

        <CalendarForm
          key={calendar.id}
          formId={FORM_ID}
          defaultValues={{
            academicYear: calendar.academicYear,
            term: calendar.term,
            startDate: calendar.startDate,
            endDate: calendar.endDate,
          }}
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
          <Button
            type="submit"
            form={FORM_ID}
            disabled={updateCalendar.isPending}
          >
            {updateCalendar.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
