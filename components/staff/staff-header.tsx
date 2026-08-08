// components/staff/staff-header.tsx
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { KeyRound, Pencil, UserCheck, UserX } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { StaffForm } from '@/components/staff/staff-form';
import type { RoleEnum, GenderEnum } from '@/lib/constants'; // adjust to your actual type location
import { StaffFormInput } from '@/types/staff';
import { useUpdateStaff } from '@/service/api/admin/staffs.api';
import { toast } from '../ui/toast';
import { isAxiosError } from 'axios';

interface Staff {
  id: string;
  staffId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: GenderEnum;
  address: string;
  email: string;
  phone: string;
  type: string;
  role: RoleEnum;
  status: 'ACTIVE' | 'INACTIVE';
}

interface StaffHeaderProps {
  staff: Staff;
}

export function StaffHeader({ staff }: StaffHeaderProps) {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateStaff = useUpdateStaff();

  const initials =
    `${staff.firstName[0] ?? ''}${staff.lastName[0] ?? ''}`.toUpperCase();
  const isActive = staff.status === 'ACTIVE';

  const handleUpdate = async (values: StaffFormInput) => {
    setIsSubmitting(true);
    try {
      const res = await updateStaff.mutateAsync({
        staffId: staff.staffId,
        data: values,
      });
      toast.add({
        title: 'Update successful',
        description: res.message,
      });
      setIsUpdateOpen(false);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.add({
          title: 'Failed to update staff profile',
          description: error.message,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = () => {
    // TODO: wire useResetStaffPassword mutation
    console.log('reset password for', staff.id);
  };

  const handleDeactivate = () => {
    // TODO: wire useDeactivateStaff mutation
    console.log('deactivate', staff.id);
  };

  const handleReactivate = () => {
    // TODO: wire useReactivateStaff mutation
    console.log('reactivate', staff.id);
  };

  return (
    <div className="bg-sidebar rounded-lg p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {initials || '—'}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                {staff.firstName} {staff.lastName}
              </h2>
              <Badge variant={isActive ? 'default' : 'secondary'}>
                {staff.status}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              {staff.role} · Staff ID {staff.staffId}
            </p>

            <div className="grid grid-cols-1 gap-x-6 gap-y-1 pt-2 text-sm sm:grid-cols-2">
              <p>
                <span className="text-muted-foreground">Email: </span>
                {staff.email}
              </p>
              <p>
                <span className="text-muted-foreground">Phone: </span>
                {staff.phone}
              </p>
              <p>
                <span className="text-muted-foreground">Gender: </span>
                {staff.gender === 'MALE' ? 'Male' : 'Female'}
              </p>
              <p>
                <span className="text-muted-foreground">Date of Birth: </span>
                {format(new Date(staff.dateOfBirth), 'PPP')}
              </p>
              <p className="sm:col-span-2">
                <span className="text-muted-foreground">Address: </span>
                {staff.address}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:flex-col sm:items-stretch">
          <Button variant="outline" onClick={() => setIsUpdateOpen(true)}>
            <Pencil className="h-4 w-4" />
            Update Profile
          </Button>
          <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Staff Profile</DialogTitle>
              </DialogHeader>
              <StaffForm
                defaultValues={{
                  firstName: staff.firstName,
                  lastName: staff.lastName,
                  email: staff.email,
                  phone: staff.phone,
                  role: staff.role,
                  gender: staff.gender,
                  dateOfBirth: staff.dateOfBirth,
                  address: staff.address,
                }}
                onSubmit={handleUpdate}
                isSubmitting={isSubmitting}
                submitLabel="Update Staff"
              />
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="outline">
                  <KeyRound className="h-4 w-4" />
                  Reset Password
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset password?</AlertDialogTitle>
                <AlertDialogDescription>
                  This generates a new temporary password for {staff.firstName}{' '}
                  {staff.lastName} and invalidates their current one.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetPassword}>
                  Reset Password
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {isActive ? (
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button variant="destructive">
                    <UserX className="h-4 w-4" />
                    Deactivate Profile
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Deactivate this staff profile?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {staff.firstName} {staff.lastName} will lose access to the
                    platform until reactivated. This does not delete their
                    record.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeactivate}>
                    Deactivate
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button variant="outline">
                    <UserCheck className="h-4 w-4" />
                    Reactivate Profile
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Reactivate this staff profile?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {staff.firstName} {staff.lastName} will regain access to the
                    platform.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReactivate}>
                    Reactivate
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}
