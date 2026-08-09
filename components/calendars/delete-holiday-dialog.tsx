'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Holiday } from '@/types/calendar';

type DeleteHolidayDialogProps = {
  holiday: Holiday | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteHolidayDialog({
  holiday,
  open,
  onOpenChange,
}: DeleteHolidayDialogProps) {
  const isPending = false; // TODO: replace with mutation's isPending once wired

  if (!holiday) return null;

  const handleDelete = () => {
    // TODO: call useDeleteHoliday mutation with { id: holiday.id }
    // On success: invalidate the calendar/holidays query, toast, then onOpenChange(false)
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Holiday</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{holiday.name}&quot;? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleDelete}>
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
