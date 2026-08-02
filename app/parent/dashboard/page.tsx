'use client';

import { TopBar } from '@/components/top-bar';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { useParentContext } from '@/lib/parent-context';
import { calcAge, getTimeOfDay } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShieldQuestionMark } from 'lucide-react';
import Link from 'next/link';
import { useGetChildren } from '@/service/api/parent/children.api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ParentOverview() {
  const authCtx = useParentContext();
  const { data: childrenData } = useGetChildren();

  const children = childrenData?.data ?? [];
  const { user: parentData } = authCtx;

  return (
    <div className="space-y-4">
      <TopBar
        title="Parent Overview"
        subtitle="Catch up with lates activities"
      />

      <div className="p-4 bg-sidebar">
        <div className="space-y-4">
          <header className="space-y-1">
            <h1 className="text-3xl font-bold">Good {getTimeOfDay()}!</h1>
            <p className="text-muted-foreground">
              Welcome what would like to do today?
            </p>
          </header>

          {parentData ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Account Information
                </CardTitle>
                <CardDescription>
                  <div className="space-y-3">
                    <dl className="flex items-center gap-10">
                      <div>
                        <dt className="font-semibold">Account Email:</dt>
                        <dd>{parentData.accountEmail}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Account Phone:</dt>
                        <dd>{parentData.accountPhone}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Address:</dt>
                        <dd>{parentData.address}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Marital Status:</dt>
                        <dd>{parentData.maritalStatus}</dd>
                      </div>
                    </dl>
                  </div>
                </CardDescription>
                <CardAction>
                  <Button variant="link">
                    <Link href="/parent/dashboard/profile"></Link>View Profile
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Children</h2>
                  {children.length > 0 ? (
                    <div className="grid grid-cols-3">
                      {children.map((child) => (
                        <Card key={child.id}>
                          <CardHeader>
                            <div className="space-y-2">
                              <Avatar>
                                <AvatarImage
                                  src={child.passportPhoto || undefined}
                                />
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
                {/* <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">
                      Father Information
                    </h2>
                    <dl className="flex flex-col gap-4 text-muted-foreground">
                      <div>
                        <dt className="font-semibold">Name:</dt>
                        <dd>
                          {parentData.fatherFirstName}{' '}
                          {parentData.fatherLastName}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Phone:</dt>
                        <dd>{parentData.fatherPhone}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Email:</dt>
                        <dd>{parentData.fatherEmail}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Occupation:</dt>
                        <dd>{parentData.fatherOccupation}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">
                      Mother Information
                    </h2>
                    <dl className="flex flex-col gap-4 text-muted-foreground">
                      <div>
                        <dt className="font-semibold">Name:</dt>
                        <dd>
                          {parentData.motherFirstName}{' '}
                          {parentData.motherLastName}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Phone:</dt>
                        <dd>{parentData.motherPhone}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Email:</dt>
                        <dd>{parentData.motherEmail}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Occupation:</dt>
                        <dd>{parentData.motherOccupation}</dd>
                      </div>
                    </dl>
                  </div>
                </div> */}
              </CardContent>
            </Card>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ShieldQuestionMark />
                </EmptyMedia>
                <EmptyTitle>You are not authenticated</EmptyTitle>
                <EmptyDescription>
                  Sign in to continue using services
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button>
                  <Link href="/parent/login">Sign in</Link>
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </div>
      </div>
    </div>
  );
}
