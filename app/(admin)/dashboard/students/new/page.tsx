'use client';

import { StudentForm } from '@/components/students/student-form';
import { TopBar } from '@/components/top-bar';
import { toast } from '@/components/ui/toast';
import { useRegisterStudent } from '@/service/api/admin/students.api';
import { type NewStudentFormOutput } from '@/types/student';
import { isAxiosError } from 'axios';

export default function RegisterNewStudentPage() {
  const registerStudent = useRegisterStudent();

  async function onSubmit(data: NewStudentFormOutput) {
    try {
      const res = await registerStudent.mutateAsync(data);
      toast.add({
        title: 'Registration complete',
        description: res.message,
      });
    } catch (err) {
      if (isAxiosError(err)) {
        toast.add({
          title: 'Registration failed',
          description: err?.message,
        });
      } else {
        toast.add({
          title: 'Failed to register student',
        });
      }
    }
  }

  return (
    <div className="space-y-4">
      <TopBar title="Register new student" />

      <div className="bg-sidebar p-4">
        <StudentForm mode="create" onSubmit={onSubmit} />
      </div>
    </div>
  );
}
