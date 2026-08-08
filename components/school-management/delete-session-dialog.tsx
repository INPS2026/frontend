'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { GetAllAcademicSessionsResponse } from '@/types/config';

type Session = Awaited<GetAllAcademicSessionsResponse>['data'][number];

export function DeleteSessionDialog({
  session,
  trigger,
  onSuccess,
}: {
  session: Session;
  trigger: React.ReactElement;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);

  // TODO: wire up useDeleteAcademicSession mutation
  const handleDelete = async () => {
    console.log('delete session', session.id);
    // await deleteSession(session.id, { onSuccess: () => { setOpen(false); onSuccess?.(); } });
    setOpen(false);
    onSuccess?.();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={trigger} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {session.session}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this session and all of its terms. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
