import { PresignedPost } from '@aws-sdk/s3-presigned-post';

import { FileMeta } from '../FileMeta';

export type PostGenerateUploadUrlsRequest = Pick<FileMeta, 'fingerprint' | 'digest'>[];

export type PostGenerateUploadUrlsResponse = {
  uploadUrls: Record<string, PresignedPost>;
  existingFingerprintsInDb: string[];
};
