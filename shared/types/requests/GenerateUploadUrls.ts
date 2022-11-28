import { PresignedPost } from '@aws-sdk/s3-presigned-post';

import { FileMeta } from '../FileMeta';

export type PostGenerateUploadUrlsRequestBody = Array<Pick<FileMeta, 'id' | 'hash'>>;

export type PostGenerateUploadUrlsResponseBody = Array<{
  id: FileMeta['id'];
  presignedPost: PresignedPost;
}>;
