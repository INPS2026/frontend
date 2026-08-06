'use client';

import React from 'react';
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
import { Button } from '@/components/ui/button';

interface DeleteStudentDialogProps {
  admissionNumber: string;
  studentName: string;
  /** Called after successful deletion (e.g. redirect, refetch list, close row) */
  onSuccess?: () => void;
  /** Optional custom trigger; defaults to a destructive "Delete" button */
  trigger?: React.ReactElement;
}

export function DeleteStudentDialog({
  admissionNumber,
  studentName,
  onSuccess,
  trigger,
}: DeleteStudentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // TODO: call delete mutation with admissionNumber
      setOpen(false);
      onSuccess?.();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={trigger ?? <Button variant="destructive">Delete</Button>}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {studentName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove {studentName} (Admission No:{' '}
            {admissionNumber}) and all associated records. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
