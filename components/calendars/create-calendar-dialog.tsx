'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCreateSchoolCalendar } from '@/service/api/admin/config.api';
import { CalendarForm } from './calendar-form';
import { CalendarFormOutput } from '@/lib/calendar-utils';
import { toast } from '../ui/toast';
import { formatTerm } from '@/lib/format';
import { isAxiosError } from 'axios';

const FORM_ID = 'create-calendar-form';

export function CreateCalendarDialog() {
  const [open, setOpen] = useState(false);
  const createCalendar = useCreateSchoolCalendar();

  const handleSubmit = async (values: CalendarFormOutput) => {
    try {
      await createCalendar.mutateAsync(values);
      toast.add({
        title: 'Calendar created successfully',
        description: `Added calendar for ${values.academicYear} ${formatTerm(values.term)}`,
      });
      setOpen(false);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.add({
          title: 'Failed to create calendar',
          description: error.message,
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-1.5 size-4" />
            Create Calendar
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Calendar</DialogTitle>
        </DialogHeader>

        <CalendarForm formId={FORM_ID} onSubmit={handleSubmit} />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            disabled={createCalendar.isPending}
          >
            {createCalendar.isPending ? 'Creating...' : 'Create Calendar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
