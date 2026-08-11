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

const TARGET_LABEL: Record<Communication['target'], string> = {
  ALL: 'all parents and staff',
  PARENTS: 'all parents',
  STAFF: 'all staff',
};

type CommunicationSendEmailDialogProps = {
  communication: Communication | null;
  open: boolean;
  isPending?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (communication: Communication) => void;
};

export function CommunicationSendEmailDialog({
  communication,
  open,
  isPending,
  onOpenChange,
  onConfirm,
}: CommunicationSendEmailDialogProps) {
  if (!communication) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Send via email?</AlertDialogTitle>
          <AlertDialogDescription>
            This will immediately email{' '}
            <span className="font-medium text-foreground">
              &ldquo;{communication.title}&rdquo;
            </span>{' '}
            to{' '}
            <span className="font-medium text-foreground">
              {TARGET_LABEL[communication.target]}
            </span>
            . This cannot be undone once sent.
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
            {isPending ? 'Sending...' : 'Send email'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
