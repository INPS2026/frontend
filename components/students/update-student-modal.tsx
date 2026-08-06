'use client';

import {
  StudentForm,
  mapStudentToFormValues,
} from '@/components/students/student-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUpdateStudentRecord } from '@/service/api/admin/students.api';
import type {
  GetStudentByAdmissionNoResponse,
  NewStudentFormOutput,
} from '@/types/student';
import { toast } from '../ui/toast';
import { isAxiosError } from 'axios';

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
  const updateStudentRecord = useUpdateStudentRecord();

  const handleSubmit = async (
    _data: NewStudentFormOutput,
    changedValues?: Partial<NewStudentFormOutput>,
  ) => {
    try {
      const res = await updateStudentRecord.mutateAsync({
        admissionNum: student.admissionNumber,
        data: changedValues ?? {},
      });
      toast.add({
        title: 'Update successful',
        description: res.message,
      });
      onOpenChange(false);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.add({
          title: 'Failed to update record',
          description: error.message,
        });
      }
      toast.add({
        title: 'Something went wrong',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Student</DialogTitle>
        </DialogHeader>
        <StudentForm
          mode="update"
          initialValues={mapStudentToFormValues(student)}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
