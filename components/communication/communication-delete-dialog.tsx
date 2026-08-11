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

import { Communication } from '@/types/communication';

type CommunicationDeleteDialogProps = {
  communication: Communication | null;
  open: boolean;
  isPending?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (communication: Communication) => void;
};

export function CommunicationDeleteDialog({
  communication,
  open,
  isPending,
  onOpenChange,
  onConfirm,
}: CommunicationDeleteDialogProps) {
  if (!communication) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete communication?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{' '}
            <span className="font-medium text-foreground">
              &ldquo;{communication.title}&rdquo;
            </span>
            . This action cannot be undone.
            {communication.status === 'PUBLISHED' && (
              <span className="mt-2 block text-destructive">
                This communication is currently published and may have already
                been sent to recipients.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault();
              onConfirm(communication);
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
