'use client';

import { format } from 'date-fns';
import { FileText } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { Communication, CommunicationStatusEnum } from '@/types/communication';

const STATUS_BADGE_VARIANT: Record<
  CommunicationStatusEnum,
  'default' | 'secondary' | 'outline'
> = {
  DRAFT: 'outline',
  PUBLISHED: 'default',
  ARCHIVED: 'secondary',
};

type CommunicationViewDialogProps = {
  communication: Communication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CommunicationViewDialog({
  communication,
  open,
  onOpenChange,
}: CommunicationViewDialogProps) {
  if (!communication) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{communication.type}</Badge>
            <Badge variant={STATUS_BADGE_VARIANT[communication.status]}>
              {communication.status}
            </Badge>
            {communication.announcementCategory && (
              <Badge variant="secondary">
                {communication.announcementCategory}
              </Badge>
            )}
          </div>
          <DialogTitle className="pt-2">{communication.title}</DialogTitle>
          <DialogDescription>
            Target: {communication.target}
            {communication.sectionId &&
              ` · Section: ${communication.sectionId}`}
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="max-h-75 overflow-y-auto whitespace-pre-wrap text-sm text-foreground">
          {communication.content}
        </div>

        {communication.fileUrl && (
          <a
            href={communication.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <FileText className="size-4" />
            View attachment
          </a>
        )}

        <Separator />

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <span>
            Published:{' '}
            {communication.publishedAt
              ? format(new Date(communication.publishedAt), 'PPp')
              : '—'}
          </span>
          <span>
            Sent:{' '}
            {communication.sentAt
              ? format(new Date(communication.sentAt), 'PPp')
              : '—'}
          </span>
          <span>
            Created: {format(new Date(communication.createdAt), 'PPp')}
          </span>
          <span>
            Updated: {format(new Date(communication.updatedAt), 'PPp')}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
