import { PresignedPost } from '@aws-sdk/s3-presigned-post';

export type PostGenerateUploadUrlsRequest = string[];

export type PostGenerateUploadUrlsResponse = {
  uploadUrls: Record<string, PresignedPost>;
  existingHashesInDb: string[];
};
