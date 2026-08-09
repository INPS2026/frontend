'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAcademicYearOptions } from '@/lib/academic-year';
import { formatTerm } from '@/lib/format';
import { TermEnum, TERMS } from '@/types/term';

export type CalendarFiltersValue = {
  academicYear: string;
  term: TermEnum | 'ALL';
};

type CalendarFiltersProps = {
  value: CalendarFiltersValue;
  onChange: (value: CalendarFiltersValue) => void;
};

export function CalendarFilters({ value, onChange }: CalendarFiltersProps) {
  const academicYearOptions = getAcademicYearOptions();

  return (
    <div className="flex flex-wrap items-center gap-3 px-4">
      <Select
        value={value.academicYear}
        onValueChange={(newValue) => {
          if (!newValue) return; // Select is Base UI-backed: value can be null
          onChange({ ...value, academicYear: newValue });
        }}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Academic Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Academic Years</SelectItem>
          {academicYearOptions.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={value.term}
        onValueChange={(newValue) => {
          if (!newValue) return;
          onChange({ ...value, term: newValue });
        }}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Term" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Terms</SelectItem>
          {TERMS.map((term) => (
            <SelectItem key={term} value={term}>
              {formatTerm(term)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
