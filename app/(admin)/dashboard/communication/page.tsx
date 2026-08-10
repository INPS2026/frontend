'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';

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

import { useGetCommunications } from '@/service/api/admin/communication.api';
import {
  Communication,
  CommunicationStatus,
  CommunicationStatusEnum,
  CommunicationTarget,
  CommunicationTargetEnum,
  CommunicationType,
  CommunicationTypeEnum,
} from '@/types/communication';
import { CommunicationViewDialog } from '@/components/communication/communication-view-dialog';

const STATUS_BADGE_VARIANT: Record<
  CommunicationStatusEnum,
  'default' | 'secondary' | 'outline'
> = {
  DRAFT: 'outline',
  PUBLISHED: 'default',
  ARCHIVED: 'secondary',
};

export default function CommunicationPage() {
  const [type, setType] = useState<CommunicationTypeEnum | 'All'>('All');
  const [status, setStatus] = useState<CommunicationStatusEnum | 'All'>('All');
  const [target, setTarget] = useState<CommunicationTargetEnum | 'All'>('All');
  const [pagination, setPagination] = useState({ page: 1, limit: 20 });
  const [viewCommunication, setViewCommunication] =
    useState<Communication | null>(null);

  const { data: communicationsData, isLoading } = useGetCommunications({
    ...pagination,
    type: type === 'All' ? undefined : type,
    status: status === 'All' ? undefined : status,
    target: target === 'All' ? undefined : target,
  });

  const communications = communicationsData?.data ?? [];
  const meta = communicationsData?.meta;

  const resetToFirstPage = () =>
    setPagination((prev) => ({ ...prev, page: 1 }));

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
            {/* TODO: wire up view/edit/delete once mutation hooks are available */}
            <DropdownMenuItem
              onClick={() => setViewCommunication(row.original)}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log('edit', row.original.id)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => console.log('delete', row.original.id)}
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
        <div className="flex flex-wrap gap-2 bg-sidebar p-2 rounded-md">
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
    </div>
  );
}
