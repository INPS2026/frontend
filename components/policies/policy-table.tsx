'use client';

import { Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Policy } from '@/types/policy';
import { formatTerm } from '@/lib/format';

interface PolicyTableProps {
  policies: Policy[];
  onUpdate: (policy: Policy) => void;
  onDelete: (policy: Policy) => void;
}

export function PolicyTable({
  policies,
  onUpdate,
  onDelete,
}: PolicyTableProps) {
  if (policies.length === 0) {
    return (
      <div className="rounded-md border py-12 text-center text-sm text-muted-foreground">
        No promotion policies configured yet.
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-sidebar">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Academic Year</TableHead>
            <TableHead>Term</TableHead>
            <TableHead>Max Students</TableHead>
            <TableHead>Min Avg Score</TableHead>
            <TableHead>Min Attendance %</TableHead>
            <TableHead>Max Failed Subjects</TableHead>
            <TableHead>Pass Mark</TableHead>
            <TableHead>Credit Mark</TableHead>
            <TableHead>Distinction Mark</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((policy) => (
            <TableRow key={policy.id}>
              <TableCell>{policy.academicYear}</TableCell>
              <TableCell>{formatTerm(policy.term)}</TableCell>
              <TableCell>{policy.maxStudentsPerClass}</TableCell>
              <TableCell>{policy.minAverageScore}</TableCell>
              <TableCell>{policy.minAttendancePercentage}%</TableCell>
              <TableCell>{policy.maxFailedSubjects}</TableCell>
              <TableCell>{policy.passMark}</TableCell>
              <TableCell>{policy.creditMark}</TableCell>
              <TableCell>{policy.distinctionMark}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onUpdate(policy)}
                  aria-label="Update policy"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(policy)}
                  aria-label="Delete policy"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
