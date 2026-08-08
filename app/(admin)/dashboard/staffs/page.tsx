'use client';

import { TopBar } from '@/components/top-bar';
import { DataTable } from '@/components/ui/data-table';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { staffColumns } from '@/lib/columns/staff-columns';
import { useGetAllStaffs } from '@/service/api/admin/staffs.api';
import { useState } from 'react';
import { RoleEnum, ROLES } from '@/lib/constants';
import { Plus } from 'lucide-react';

export default function AllStaffsPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
  });
  const [role, setRole] = useState<string | undefined>(undefined);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: staffsData, isPending } = useGetAllStaffs({
    page: pagination.page,
    limit: pagination.limit,
    includeDeleted,
    role: role as RoleEnum | undefined,
  });

  const staffs = staffsData?.data ?? [];
  const page = staffsData?.meta?.page ?? pagination.page;
  const totalPages = staffsData?.meta?.totalPages ?? 1;

  const handleRoleChange = (value: string | null) => {
    setRole(!value || value === 'ALL' ? undefined : value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleIncludeDeletedChange = (checked: boolean) => {
    setIncludeDeleted(checked);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="space-y-4">
      <TopBar
        title="Staff Profiles"
        subtitle="View and manage staff profiles"
      />

      <div className="p-4 bg-sidebar space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Select value={role ?? 'ALL'} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-45">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All roles</SelectItem>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Switch
                id="include-deleted"
                checked={includeDeleted}
                onCheckedChange={handleIncludeDeletedChange}
              />
              <Label htmlFor="include-deleted">Show deleted</Label>
            </div>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger
              render={
                <Button>
                  <Plus className="h-4 w-4" />
                  Add Staff
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Staff</DialogTitle>
              </DialogHeader>
              {/* Form implementation goes here */}
            </DialogContent>
          </Dialog>
        </div>

        <DataTable columns={staffColumns} data={staffs} />

        <PaginationControls
          page={page}
          totalPages={totalPages}
          isPending={isPending}
          onPageChange={(nextPage) =>
            setPagination((prev) => ({ ...prev, page: nextPage }))
          }
        />
      </div>
    </div>
  );
}
