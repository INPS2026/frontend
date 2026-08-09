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
import type { Term } from '@/types/term';
import { Button } from '../ui/button';
import { formatTerm } from '@/lib/format';
import { useDeleteTerm } from '@/service/api/admin/config.api';
import { isAxiosError } from 'axios';
import { toast } from '../ui/toast';

export function DeleteTermDialog({
  term,
  open,
  onOpenChange,
}: {
  term: Term;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const deleteTerm = useDeleteTerm();

  const handleDelete = async () => {
    try {
      await deleteTerm.mutateAsync(term.id);
      toast.add({
        title: 'Term deleted',
        description: `Term ${formatTerm(term.term)} has been deleted successfully.`,
      });
      onOpenChange(false);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.add({
          title: 'Failed to delete term',
          description: error.message,
        });
      }
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {formatTerm(term.term)}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this term. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteTerm.isPending}
            render={<Button variant="destructive"> Delete</Button>}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
