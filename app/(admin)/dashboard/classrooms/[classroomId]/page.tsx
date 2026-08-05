'use client';

import { TopBar } from '@/components/top-bar';
import {
  useDeleteClassroom,
  useGetClassroomById,
  useUpdateClassroom,
} from '@/service/api/admin/classrooms.api';
import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  NewClassroomFormInput,
  NewClassroomFormOutput,
  NewClassroomSchema,
} from '@/types/classroom';
import { CLASSROOM_LEVELS } from '@/types/classroom';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/toast';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { SectionsList } from '@/components/sections/sections-list';

export default function ManageClassroomPage({
  params,
}: {
  params: Promise<{ classroomId: string }>;
}) {
  const { classroomId } = use(params);
  const { data: classroomData, isLoading } = useGetClassroomById(classroomId);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const updateClassroom = useUpdateClassroom();
  const deleteClassroom = useDeleteClassroom();
  const router = useRouter();

  const form = useForm<
    Partial<NewClassroomFormInput>,
    unknown,
    Partial<NewClassroomFormOutput>
  >({
    resolver: zodResolver(NewClassroomSchema.partial()),
    defaultValues: {
      name: '',
      level: 'DAYCARE',
    },
  });

  const classroom = classroomData?.data;

  useEffect(() => {
    if (classroom) {
      form.reset({
        name: classroom.name,
        level: classroom.level,
      });
    }
  }, [classroom, form]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <TopBar title="Manage Classroom" />
        <div className="p-4">Loading...</div>
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="space-y-4">
        <TopBar title="Manage Classroom" />
        <div className="p-4">Classroom not found.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TopBar title="Manage Classroom" />

      <div className="px-4 space-y-4">
        <div className="bg-sidebar flex items-center justify-between rounded-lg p-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{classroom.name}</h2>
              <Badge
                variant={
                  classroom.status === 'ACTIVE' ? 'default' : 'secondary'
                }
              >
                {classroom.status}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">{classroom.level}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsUpdateOpen(true)}
            >
              <Pencil className="size-4" />
              Update
            </Button>
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button variant="destructive" size="sm">
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this classroom?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete &quot;{classroom.name}&quot;
                    and cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      try {
                        await deleteClassroom.mutateAsync(classroomId);
                        toast.add({
                          title: 'Classroom deleted successfully',
                        });
                        router.push('/dashboard/classrooms');
                      } catch (error) {
                        if (isAxiosError(error)) {
                          toast.add({
                            title: 'Failed to delete classroom',
                            description: error.message,
                          });
                          return;
                        }
                        console.log(error);
                        toast.add({ title: 'Something went wrong' });
                      }
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="bg-sidebar rounded-lg p-4">
          <Tabs defaultValue="sections">
            <TabsList>
              <TabsTrigger value="sections">Sections</TabsTrigger>
              <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="fee-structure">Fee Structure</TabsTrigger>
            </TabsList>
            <TabsContent value="sections">
              <SectionsList
                classroomId={classroomId}
                sections={classroom.sections}
              />
            </TabsContent>
            <TabsContent value="enrollments">
              {/* enrollments content */}
            </TabsContent>
            <TabsContent value="curriculum">
              {/* curriculum content */}
            </TabsContent>
            <TabsContent value="fee-structure">
              {/* fee structure content */}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* update modal/drawer goes here, controlled by isUpdateOpen */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Classroom</DialogTitle>
          </DialogHeader>
          <div>
            <form
              onSubmit={form.handleSubmit(
                async (data: Partial<NewClassroomFormOutput>) => {
                  try {
                    await updateClassroom.mutateAsync({
                      classroomId,
                      data,
                    });
                    toast.add({ title: 'Classroom updated successfully' });
                    form.reset(data); // reset to the values just submitted, not stale defaults
                    setIsUpdateOpen(false);
                  } catch (error) {
                    if (isAxiosError(error)) {
                      toast.add({
                        title: 'Failed to update classroom',
                        description: error.message,
                      });
                      return;
                    }
                    toast.add({ title: 'Something went wrong during update' });
                  }
                },
              )}
              className="space-y-2"
            >
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Classroom name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="level"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Classroom level
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLASSROOM_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
              <Button type="submit">
                <Upload /> Update
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
