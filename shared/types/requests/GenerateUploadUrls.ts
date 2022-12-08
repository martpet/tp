import { PresignedPost } from '@aws-sdk/s3-presigned-post';

import { FileMeta } from '../FileMeta';

export type PostGenerateUploadUrlsRequest = Pick<
  FileMeta,
  'id' | 'fingerprint' | 'digest'
>[];

export type PostGenerateUploadUrlsResponse = {
  presignedPosts: Record<string, PresignedPost>;
  existingFingerprintsInDb: string[];
};
