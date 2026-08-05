'use client';

import { SectionCard } from './section-card';
import type { Section } from '@/types/classroom';

type SectionsListProps = {
  sections: Section[];
};

export function SectionsList({ sections }: SectionsListProps) {
  if (sections.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        No sections yet for this classroom.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sections.map((section) => (
        <SectionCard key={section.id} section={section} />
      ))}
    </div>
  );
}
