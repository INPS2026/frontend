'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ClassRoom } from '@/types/classroom';
import Link from 'next/link';

type ClassRoomCardProps = {
  classRoom: ClassRoom;
};

export function ClassRoomCard({ classRoom }: ClassRoomCardProps) {
  const { id, name, level, status } = classRoom;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-muted-foreground text-sm">{level}</p>
        </div>
        <Badge variant={status === 'ACTIVE' ? 'default' : 'secondary'}>
          {status}
        </Badge>
      </CardHeader>
      <CardContent>
        <Button size="sm">
          <Link href={`/parent/dashboard/children/${id}`}>Manage</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
