'use client';

import { ClassRoomCard } from '@/components/classroom-card';
import { TopBar } from '@/components/top-bar';
import { useGetAllClassrooms } from '@/service/api/admin/classrooms.api';

export default function AllClassroomsPage() {
  const { data: classroomsData } = useGetAllClassrooms();

  const classrooms = classroomsData?.data ?? [];

  return (
    <div className="space-y-4">
      <TopBar
        title="All Classrooms Management"
        subtitle="Manage all classrooms"
      />

      <div className="p-4 bg-sidebar">
        <div className="grid grid-cols-4 gap-4">
          {classrooms.map((classroom) => (
            <ClassRoomCard key={classroom.id} classRoom={classroom} />
          ))}
        </div>
      </div>
    </div>
  );
}
