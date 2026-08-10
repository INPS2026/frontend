'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PolicyForm } from './policy-form';
import { Policy } from '@/types/policy';
import { useDeletePolicyConfiguration } from '@/service/api/admin/policy.api';
import { toast } from '../ui/toast';
import { isAxiosError } from 'axios';

const FORM_ID = 'policy-form';

interface CreatePolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePolicyDialog({
  open,
  onOpenChange,
}: CreatePolicyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Promotion Policy</DialogTitle>
        </DialogHeader>
        <PolicyForm formId={FORM_ID} onSuccess={() => onOpenChange(false)} />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID}>
            Create Policy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface UpdatePolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy: Policy;
}

export function UpdatePolicyDialog({
  open,
  onOpenChange,
  policy,
}: UpdatePolicyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Promotion Policy</DialogTitle>
        </DialogHeader>
        <PolicyForm
          formId={FORM_ID}
          policy={policy}
          onSuccess={() => onOpenChange(false)}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface DeletePolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy: Policy;
}

export function DeletePolicyDialog({
  open,
  onOpenChange,
  policy,
}: DeletePolicyDialogProps) {
  const deletePolicy = useDeletePolicyConfiguration();

  const handleDelete = async () => {
    try {
      await deletePolicy.mutateAsync({
        academicYear: policy.academicYear,
        term: policy.term,
      });
      toast.add({
        title: 'Policy deleted successfully',
      });
      onOpenChange(false);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.add({
          title: 'Failed to delete policy',
          description: error.message,
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Promotion Policy</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete the policy for{' '}
          <span className="font-medium text-foreground">
            {policy.academicYear}
          </span>{' '}
          ({policy.term.replace('_', ' ')})? This action cannot be undone.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deletePolicy.isPending}
          >
            {deletePolicy.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
