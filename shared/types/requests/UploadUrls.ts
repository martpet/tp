import { PresignedPost } from '@aws-sdk/s3-presigned-post';

import { FileMeta } from '../FileMeta';

export type PostUploadUrlsRequest = Pick<FileMeta, 'id' | 'fingerprint' | 'digest'>[];

export type PostUploadUrlsResponse = {
  presignedPosts: Record<string, PresignedPost>;
  existingFingerprintsInDb: string[];
};
