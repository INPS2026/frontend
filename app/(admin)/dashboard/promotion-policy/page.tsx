'use client';

import {
  CreatePolicyDialog,
  DeletePolicyDialog,
  UpdatePolicyDialog,
} from '@/components/policies/policy-dialogs';
import { PolicyTable } from '@/components/policies/policy-table';
import { TopBar } from '@/components/top-bar';
import { Button } from '@/components/ui/button';
import { useGetPolicyConfigurations } from '@/service/api/admin/policy.api';
import { Policy } from '@/types/policy';
import { Plus } from 'lucide-react';
import { useState } from 'react';

type ActiveDialog =
  | { type: 'create' }
  | { type: 'update'; policy: Policy }
  | { type: 'delete'; policy: Policy }
  | null;

export default function PromotionPolicyPage() {
  const { data: policyData, isLoading } = useGetPolicyConfigurations();
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);

  const policies = policyData?.data ?? [];

  return (
    <div className="space-y-4">
      <TopBar
        title="Promotion Policy"
        subtitle="Manage promotion policy configurations"
      />
      <div className="px-4 space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => setActiveDialog({ type: 'create' })}>
            <Plus className="mr-2 h-4 w-4" />
            Create Policy
          </Button>
        </div>
        <div>
          {isLoading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Loading policies...
            </div>
          ) : (
            <PolicyTable
              policies={policies}
              onUpdate={(policy) => setActiveDialog({ type: 'update', policy })}
              onDelete={(policy) => setActiveDialog({ type: 'delete', policy })}
            />
          )}
        </div>
      </div>

      <CreatePolicyDialog
        open={activeDialog?.type === 'create'}
        onOpenChange={(open) =>
          setActiveDialog(open ? { type: 'create' } : null)
        }
      />

      {activeDialog?.type === 'update' && (
        <UpdatePolicyDialog
          open
          policy={activeDialog.policy}
          onOpenChange={(open) => !open && setActiveDialog(null)}
        />
      )}

      {activeDialog?.type === 'delete' && (
        <DeletePolicyDialog
          open
          policy={activeDialog.policy}
          onOpenChange={(open) => !open && setActiveDialog(null)}
        />
      )}
    </div>
  );
}
