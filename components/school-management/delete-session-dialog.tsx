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
import { useDeleteAcademicSession } from '@/service/api/admin/config.api';
import { toast } from '../ui/toast';
import { isAxiosError } from 'axios';
import { Button } from '../ui/button';

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
  const deleteSession = useDeleteAcademicSession();

  const handleDelete = async () => {
    try {
      await deleteSession.mutateAsync(session.id);
      toast.add({
        title: 'Session deleted successfully',
      });
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      if (isAxiosError(error)) {
        toast.add({
          title: 'Failed to delete session',
          description: error.message,
        });
      }
    }
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
            disabled={deleteSession.isPending}
            render={<Button variant="destructive">Delete</Button>}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
