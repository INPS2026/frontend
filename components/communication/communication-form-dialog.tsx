'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import {
  CommunicationForm,
  CommunicationFormValues,
} from './communication-form';
import { Communication } from '@/types/communication';

type CommunicationFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communication?: Communication | null;
  isPending?: boolean;
  onSubmit: (values: CommunicationFormValues) => void;
};

export function CommunicationFormDialog({
  open,
  onOpenChange,
  communication,
  isPending,
  onSubmit,
}: CommunicationFormDialogProps) {
  const formId = 'communication-form';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {communication ? 'Edit Communication' : 'New Communication'}
          </DialogTitle>
        </DialogHeader>

        <CommunicationForm
          key={communication?.id ?? 'create'}
          formId={formId}
          defaultValues={communication}
          onSubmit={onSubmit}
        />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit" form={formId} disabled={isPending}>
            {communication ? 'Save changes' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
