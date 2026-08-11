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

type CommunicationPublishDialogProps = {
  communication: Communication | null;
  open: boolean;
  isPending?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (communication: Communication) => void;
};

export function CommunicationPublishDialog({
  communication,
  open,
  isPending,
  onOpenChange,
  onConfirm,
}: CommunicationPublishDialogProps) {
  if (!communication) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Publish communication?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">
              &ldquo;{communication.title}&rdquo;
            </span>{' '}
            will become visible to{' '}
            <span className="font-medium text-foreground">
              {communication.target}
            </span>
            . You can still edit or archive it afterward.
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
          >
            {isPending ? 'Publishing...' : 'Publish'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
