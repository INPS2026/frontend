'use client';

import { TopBar } from '@/components/top-bar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/utils';
import {
  useGetChildProfile,
  useGetOutstandingFees,
  useGetPaymentHistory,
} from '@/service/api/parent/children.api';
import { FileText, ThumbsUp } from 'lucide-react';
import { use } from 'react';

export default function StudentProfilePage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = use(params);
  const { data: childProfileData } = useGetChildProfile(studentId);
  const { data: outstandingFeesData } = useGetOutstandingFees(studentId);
  const { data: paymentHistoryData } = useGetPaymentHistory(studentId);

  const profile = childProfileData?.data;
  const outstandingFees = outstandingFeesData?.data ?? {
    totalOutstanding: 0,
    invoice: [],
  };
  const paymentHistory = paymentHistoryData?.data ?? [];

  return (
    <div className="space-y-4">
      <TopBar title="Student Profile" />

      <div className="p-4 bg-sidebar">
        {profile && (
          <Card>
            <CardHeader>
              <div className="space-y-1">
                <Avatar size="lg">
                  <AvatarImage src={profile.passportPhoto || undefined} />
                  <AvatarFallback>
                    {profile.firstName[0].toUpperCase()}
                    {profile.lastName[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg font-semibold">
                  {profile.firstName} {profile.lastName}
                </CardTitle>
              </div>
              <CardDescription>
                <dl className="grid grid-cols-4 gap-y-2">
                  <div className="flex gap-1">
                    <dt className="font-semibold">Admission No.:</dt>
                    <dd>{profile.admissionNumber}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="font-semibold">Gender:</dt>
                    <dd>{profile.gender}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="font-semibold">Date of birth:</dt>
                    <dd>{formatDate(profile.dateOfBirth)}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="font-semibold">Nationality:</dt>
                    <dd>{profile.nationality}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="font-semibold">State:</dt>
                    <dd>{profile.state}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="font-semibold">LGA:</dt>
                    <dd>{profile.lga}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="font-semibold">Religion:</dt>
                    <dd>{profile.religion}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="font-semibold">Sport house:</dt>
                    <dd>{profile.sportHouse}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="font-semibold">Address:</dt>
                    <dd>{profile.address}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="font-semibold">Intake type:</dt>
                    <dd>{profile.intakeType}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="font-semibold">Admission date:</dt>
                    <dd>{formatDate(profile.admissionDate)}</dd>
                  </div>
                </dl>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="finance">
                <TabsList>
                  <TabsTrigger value="finance">Finance</TabsTrigger>
                </TabsList>
                <TabsContent value="finance" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Outstanding Fees</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {outstandingFees.totalOutstanding > 0 &&
                      outstandingFees.invoice.length ? (
                        <div>{/* TODO: render outstanding fees */}</div>
                      ) : (
                        <Empty>
                          <EmptyHeader>
                            <EmptyMedia>
                              <ThumbsUp />
                            </EmptyMedia>
                            <EmptyTitle>No outstanding fees</EmptyTitle>
                          </EmptyHeader>
                        </Empty>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {paymentHistory.length > 0 ? (
                        <div>{/* TODO: render payment history */}</div>
                      ) : (
                        <Empty>
                          <EmptyHeader>
                            <EmptyMedia>
                              <FileText />
                            </EmptyMedia>
                            <EmptyTitle>Nothing to show here</EmptyTitle>
                          </EmptyHeader>
                        </Empty>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
