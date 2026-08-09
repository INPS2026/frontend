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

export function DeleteTermDialog({
  term,
  open,
  onOpenChange,
  onSuccess,
}: {
  term: Term;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  // TODO: wire up useDeleteTerm mutation
  const handleDelete = async () => {
    console.log('delete term', term.id);
    // await deleteTerm(term.id, { onSuccess: () => { setOpen(false); onSuccess?.(); } });
    // setOpen(false);
    onSuccess?.();
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
            render={<Button variant="destructive"> Delete</Button>}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
