'use client';

import { useMemo, useState } from 'react';
import { useGetClassroomFeeStructure } from '@/service/api/admin/finance.api';
import { TERMS, Term } from '@/types/term';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAcademicYearOptions } from '@/lib/academic-year';
import { formatTerm } from '@/lib/format';

type FeeStructureTabProps = {
  classroomId: string;
};

export function FeeStructureTab({ classroomId }: FeeStructureTabProps) {
  const academicYearOptions = useMemo(() => getAcademicYearOptions(), []);

  const [params, setParams] = useState<{ academicYear: string; term: Term }>({
    academicYear: academicYearOptions[2],
    term: 'FIRST_TERM',
  });

  const { data, isLoading } = useGetClassroomFeeStructure(classroomId, params);

  const bills = data?.data.bills ?? [];
  const total = data?.data.total ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <Field>
          <FieldLabel htmlFor="academicYear">Academic Year</FieldLabel>
          <Select
            value={params.academicYear}
            onValueChange={(value) => {
              if (!value) return;
              setParams((prev) => ({ ...prev, academicYear: value }));
            }}
          >
            <SelectTrigger id="academicYear" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {academicYearOptions.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="term">Term</FieldLabel>
          <Select
            value={params.term}
            onValueChange={(value) => {
              if (!value) return;
              setParams((prev) => ({ ...prev, term: value as Term }));
            }}
          >
            <SelectTrigger id="term" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TERMS.map((term) => (
                <SelectItem key={term} value={term}>
                  {formatTerm(term)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">
          Loading fee structure...
        </p>
      ) : bills.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">
          No fee structure set for this term.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bill</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell>{bill.name}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(bill.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-semibold">Total</TableCell>
              <TableCell className="text-right font-semibold">
                {formatCurrency(total)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </div>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);
}
