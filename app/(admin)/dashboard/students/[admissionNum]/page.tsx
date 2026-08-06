'use client';

import { useState } from 'react';
import { use } from 'react';
import { TopBar } from '@/components/top-bar';
import { useGetStudentByAdmissionNo } from '@/service/api/admin/students.api';
import { StudentHeader } from '@/components/students/student-header';
import { UpdateStudentModal } from '@/components/students/update-student-modal';
import { EnrollmentsTab } from '@/components/students/enrollments-tab';
import { ResultsTab } from '@/components/students/results-tab';
import { SubjectsTab } from '@/components/students/subjects-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function StudentProfilePage({
  params,
}: {
  params: Promise<{ admissionNum: string }>;
}) {
  const { admissionNum } = use(params);
  const { data: studentData } = useGetStudentByAdmissionNo(admissionNum);

  const student = studentData?.data;

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const handleDelete = () => {
    // TODO: call delete mutation, handle confirmation, redirect on success
  };

  return (
    <div className="space-y-4">
      <TopBar title="Student Profile" subtitle="Manage student activities" />

      <div className="p-4 bg-sidebar rounded-lg">
        <StudentHeader
          student={student}
          onUpdate={() => setIsUpdateModalOpen(true)}
        />
      </div>

      <Tabs defaultValue="enrollments">
        <TabsList>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
        </TabsList>

        <TabsContent value="enrollments">
          <EnrollmentsTab admissionNumber={admissionNum} />
        </TabsContent>
        <TabsContent value="results">
          <ResultsTab admissionNumber={admissionNum} />
        </TabsContent>
        <TabsContent value="subjects">
          <SubjectsTab admissionNumber={admissionNum} />
        </TabsContent>
      </Tabs>

      {student && (
        <UpdateStudentModal
          student={student}
          open={isUpdateModalOpen}
          onOpenChange={setIsUpdateModalOpen}
        />
      )}
    </div>
  );
}
