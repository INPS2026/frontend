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
import { useRemoveHoliday } from '@/service/api/admin/config.api';
import type { Holiday } from '@/types/calendar';
import { toast } from '../ui/toast';
import { isAxiosError } from 'axios';

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
  const removeHoliday = useRemoveHoliday();
  const isPending = removeHoliday.isPending;

  if (!holiday) return null;

  const handleDelete = async () => {
    try {
      await removeHoliday.mutateAsync(holiday.id);
      toast.add({
        title: 'Holiday removed successfully',
      });
      onOpenChange(false);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.add({
          title: 'Failed to remove holiday',
          description: error.message,
        });
      }
    }
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
