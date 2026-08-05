// components/sections/sections-list.tsx
import { SectionCard } from './section-card';
import { AddSectionDialog } from './add-section-dialog';
import type { Section } from '@/types/section';

type SectionsListProps = {
  classroomId: string;
  sections: Section[];
};

export function SectionsList({ classroomId, sections }: SectionsListProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddSectionDialog classroomId={classroomId} />
      </div>

      {sections.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">
          No sections yet for this classroom.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>
      )}
    </div>
  );
}
