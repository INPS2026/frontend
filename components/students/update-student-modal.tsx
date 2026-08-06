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
import type {
  GetStudentByAdmissionNoResponse,
  NewStudentFormOutput,
} from '@/types/student';

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
  const handleSubmit = async (
    _data: NewStudentFormOutput,
    changedValues?: Partial<NewStudentFormOutput>,
  ) => {
    console.log('Changed student values:', changedValues ?? {});
    onOpenChange(false);
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
