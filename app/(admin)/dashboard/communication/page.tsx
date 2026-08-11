'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal, Plus } from 'lucide-react';

import { TopBar } from '@/components/top-bar';
import { DataTable } from '@/components/ui/data-table';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { CommunicationViewDialog } from '@/components/communication/communication-view-dialog';
import { CommunicationFormDialog } from '@/components/communication/communication-form-dialog';
import { CommunicationFormValues } from '@/components/communication/communication-form';
import { CommunicationDeleteDialog } from '@/components/communication/communication-delete-dialog';

import {
  useCreateCommunication,
  useDeleteCommunication,
  useGetCommunications,
  usePublishCommunication,
  useSendCommunicationEmail,
  useUpdateCommunication,
} from '@/service/api/admin/communication.api';
import {
  Communication,
  CommunicationStatus,
  CommunicationStatusEnum,
  CommunicationTarget,
  CommunicationTargetEnum,
  CommunicationType,
  CommunicationTypeEnum,
} from '@/types/communication';
import { toast } from '@/components/ui/toast';
import { isAxiosError } from 'axios';
import { CommunicationPublishDialog } from '@/components/communication/communication-publish-dialog';
import { CommunicationSendEmailDialog } from '@/components/communication/communication-send-email-dialog';

const STATUS_BADGE_VARIANT: Record<
  CommunicationStatusEnum,
  'default' | 'secondary' | 'outline'
> = {
  DRAFT: 'outline',
  PUBLISHED: 'default',
  ARCHIVED: 'secondary',
};

type ActiveDialog =
  | { type: 'create' }
  | { type: 'update'; entity: Communication }
  | { type: 'delete'; entity: Communication }
  | { type: 'publish'; entity: Communication }
  | { type: 'send-email'; entity: Communication }
  | null;

export default function CommunicationPage() {
  const [type, setType] = useState<CommunicationTypeEnum | 'All'>('All');
  const [status, setStatus] = useState<CommunicationStatusEnum | 'All'>('All');
  const [target, setTarget] = useState<CommunicationTargetEnum | 'All'>('All');
  const [pagination, setPagination] = useState({ page: 1, limit: 20 });

  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);
  const [viewCommunication, setViewCommunication] =
    useState<Communication | null>(null);

  const { data: communicationsData, isLoading } = useGetCommunications({
    ...pagination,
    type: type === 'All' ? undefined : type,
    status: status === 'All' ? undefined : status,
    target: target === 'All' ? undefined : target,
  });
  const createCommunication = useCreateCommunication();
  const updateCommunication = useUpdateCommunication();
  const deleteCommunication = useDeleteCommunication();
  const publishCommunication = usePublishCommunication();
  const sendCommunication = useSendCommunicationEmail();

  const communications = communicationsData?.data ?? [];
  const meta = communicationsData?.meta;

  const resetToFirstPage = () =>
    setPagination((prev) => ({ ...prev, page: 1 }));

  const handleFormSubmit = async (values: CommunicationFormValues) => {
    try {
      if (activeDialog?.type === 'update') {
        await updateCommunication.mutateAsync({
          communicationId: activeDialog.entity.id,
          data: values,
        });
        toast.add({
          title: 'Communication updated successfully',
        });
      } else {
        await createCommunication.mutateAsync(values);
        toast.add({
          title: 'Communication created successfully',
        });
      }
      setActiveDialog(null);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.add({
          title: `Failed to ${activeDialog?.type === 'update' ? 'update' : 'create'} communication`,
          description: error.message,
        });
      }
    }
  };

  const handleDeleteConfirm = async (communication: Communication) => {
    try {
      await deleteCommunication.mutateAsync(communication.id);
      toast.add({
        title: 'Communication deleted successfully',
      });
      setActiveDialog(null);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.add({
          title: 'Failed to delete communication',
          description: error.message,
        });
      }
    }
  };

  // TODO: wire to usePublishCommunication / useSendCommunicationEmail once available
  const handlePublishConfirm = async (communication: Communication) => {
    try {
      await publishCommunication.mutateAsync(communication.id);
      toast.add({
        title: 'Communication was published successfully',
      });
      setActiveDialog(null);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.add({
          title: 'Failed to publish communication',
          description: error.message,
        });
      }
    }
  };

  const handleSendEmailConfirm = async (communication: Communication) => {
    try {
      await sendCommunication.mutateAsync(communication.id);
      toast.add({
        title: 'Communication was sent successfully',
      });
      setActiveDialog(null);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.add({
          title: 'Failed to send communication',
          description: error.message,
        });
      }
    }
  };

  const columns: ColumnDef<Communication>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge>,
    },
    {
      accessorKey: 'target',
      header: 'Target',
    },
    {
      accessorKey: 'announcementCategory',
      header: 'Category',
      cell: ({ row }) => row.original.announcementCategory ?? '—',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={STATUS_BADGE_VARIANT[row.original.status]}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'publishedAt',
      header: 'Published',
      cell: ({ row }) =>
        row.original.publishedAt
          ? format(new Date(row.original.publishedAt), 'PP')
          : '—',
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="size-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setViewCommunication(row.original)}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setActiveDialog({ type: 'update', entity: row.original })
              }
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={row.original.status === 'PUBLISHED'}
              onClick={() =>
                setActiveDialog({ type: 'publish', entity: row.original })
              }
            >
              Publish
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={row.original.status !== 'PUBLISHED'}
              onClick={() =>
                setActiveDialog({ type: 'send-email', entity: row.original })
              }
            >
              Send via email
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() =>
                setActiveDialog({ type: 'delete', entity: row.original })
              }
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <TopBar
        title="Communication Page"
        subtitle="Manage communication and newsletter"
      />
      <div className="px-4 space-y-4">
        <div className="flex items-center justify-between bg-sidebar p-2 rounded-md">
          <div className="flex flex-wrap gap-2">
            <Select
              value={type}
              onValueChange={(value) => {
                setType((value as CommunicationTypeEnum | 'All') ?? 'All');
                resetToFirstPage();
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All types</SelectItem>
                {CommunicationType.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus((value as CommunicationStatusEnum | 'All') ?? 'All');
                resetToFirstPage();
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All statuses</SelectItem>
                {CommunicationStatus.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={target}
              onValueChange={(value) => {
                setTarget((value as CommunicationTargetEnum | 'All') ?? 'All');
                resetToFirstPage();
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All targets</SelectItem>
                {CommunicationTarget.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={() => setActiveDialog({ type: 'create' })}>
            <Plus className="size-4" />
            New Communication
          </Button>
        </div>

        <DataTable columns={columns} data={communications} />

        {meta && (
          <PaginationControls
            page={pagination.page}
            totalPages={meta.totalPages}
            isPending={isLoading}
            onPageChange={(page: number) =>
              setPagination((prev) => ({ ...prev, page }))
            }
          />
        )}
      </div>

      <CommunicationViewDialog
        communication={viewCommunication}
        open={!!viewCommunication}
        onOpenChange={(open) => !open && setViewCommunication(null)}
      />

      <CommunicationFormDialog
        open={
          activeDialog?.type === 'create' || activeDialog?.type === 'update'
        }
        onOpenChange={(open) => !open && setActiveDialog(null)}
        communication={
          activeDialog?.type === 'update' ? activeDialog.entity : null
        }
        onSubmit={handleFormSubmit}
        isPending={
          createCommunication.isPending || updateCommunication.isPending
        }
      />

      <CommunicationDeleteDialog
        communication={
          activeDialog?.type === 'delete' ? activeDialog.entity : null
        }
        open={activeDialog?.type === 'delete'}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        onConfirm={handleDeleteConfirm}
        isPending={deleteCommunication.isPending}
      />

      <CommunicationPublishDialog
        communication={
          activeDialog?.type === 'publish' ? activeDialog.entity : null
        }
        open={activeDialog?.type === 'publish'}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        onConfirm={handlePublishConfirm}
        isPending={publishCommunication.isPending}
      />

      <CommunicationSendEmailDialog
        communication={
          activeDialog?.type === 'send-email' ? activeDialog.entity : null
        }
        open={activeDialog?.type === 'send-email'}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        onConfirm={handleSendEmailConfirm}
        isPending={sendCommunication.isPending}
      />
    </div>
  );
}
