'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { GetStudentByAdmissionNoResponse } from '@/types/student';

type Student = Awaited<GetStudentByAdmissionNoResponse>['data'];

interface UpdateStudentModalProps {
  student: Student;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateStudentModal({
  student,
  open,
  onOpenChange,
}: UpdateStudentModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Student</DialogTitle>
        </DialogHeader>
        {/* TODO: form fields prefilled from `student`, submit handler */}
      </DialogContent>
    </Dialog>
  );
}
