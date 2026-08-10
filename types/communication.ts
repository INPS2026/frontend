import { ApiResponse } from './api';

export const CommunicationType = ['ANNOUNCEMENT', 'NEWSLETTER'] as const;
export type CommunicationTypeEnum = (typeof CommunicationType)[number];

export const CommunicationStatus = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;
export type CommunicationStatusEnum = (typeof CommunicationStatus)[number];

export const CommunicationTarget = ['ALL', 'PARENTS', 'STAFF'] as const;
export type CommunicationTargetEnum = (typeof CommunicationTarget)[number];

export const AnnouncementCategory = [
  'URGENT',
  'GENERAL',
  'CLASS_UPDATE',
] as const;
export type AnnouncementCategoryEnum = (typeof AnnouncementCategory)[number];

export type Communication = {
  id: string;
  title: string;
  content: string;
  fileUrl: string | null;
  type: CommunicationTypeEnum;
  target: CommunicationTargetEnum;
  announcementCategory: AnnouncementCategoryEnum | null;
  sectionId: string | null;
  status: CommunicationStatusEnum;
  publishedAt: string;
  sentAt: string;
  createdAt: string;
  updatedAt: string;
};

export type GetCommunicationsResponse = ApiResponse<Communication[]>;
