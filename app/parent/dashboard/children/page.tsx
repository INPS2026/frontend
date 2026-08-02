'use client';

import { TopBar } from '@/components/top-bar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { calcAge } from '@/lib/utils';
import { useGetChildren } from '@/service/api/parent/children.api';
import Link from 'next/link';

export default function ParentChildrenPage() {
  const { data: childrenData } = useGetChildren();

  const children = childrenData?.data ?? [];

  return (
    <div className="space-y-4">
      <TopBar title="All Children" subtitle="View and manage your children" />

      <div className="p-4 bg-sidebar">
        {children.length > 0 ? (
          <div className="grid grid-cols-3">
            {children.map((child) => (
              <Card key={child.id}>
                <CardHeader>
                  <div className="space-y-2">
                    <Avatar>
                      <AvatarImage src={child.passportPhoto || undefined} />
                      <AvatarFallback>
                        {child.firstName[0].toUpperCase()}
                        {child.lastName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <CardTitle className="capitalize">
                        {child.firstName} {child.lastName}
                      </CardTitle>
                      <CardDescription>
                        <dl className="space-y-1">
                          <div className="flex items-center gap-1">
                            <dt className="text-accent-foreground font-semibold">
                              Admission No.:
                            </dt>
                            <dd>{child.admissionNumber}</dd>
                          </div>
                          <div className="flex items-center gap-1">
                            <dt className="text-accent-foreground font-semibold">
                              Status:
                            </dt>
                            <dd>{child.status}</dd>
                          </div>
                          <div className="flex items-center gap-1">
                            <dt className="text-accent-foreground font-semibold">
                              Age:
                            </dt>
                            <dd>{calcAge(child.dateOfBirth)}</dd>
                          </div>
                        </dl>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter>
                  <Button variant="link">
                    <Link
                      href={`/parent/dashboard/children/${child.id}/profile`}
                    >
                      View Profile
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
