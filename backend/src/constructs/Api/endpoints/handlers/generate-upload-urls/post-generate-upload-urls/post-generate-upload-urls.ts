import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { ApiRouteHeaders, HandlerEnv } from '~/constructs/Api/types';
import { errorResponse, getIdTokenPayload } from '~/constructs/Api/utils';
import { PostGenerateUploadUrlsResponse } from '~/types';

const s3Client = new S3Client({});

export const handler: APIGatewayProxyHandlerV2<PostGenerateUploadUrlsResponse> = async (
  event
) => {
  const { authorization } = event.headers as ApiRouteHeaders<'/settings'>;
  const { photosBucket } = process.env as HandlerEnv<'/generate-upload-urls', 'POST'>;

  if (!authorization) {
    return errorResponse('Vf5Ph6qN1S');
  }

  if (!photosBucket) {
    return errorResponse('1rQkj3kpp4');
  }

  const { sub } = getIdTokenPayload(authorization);

  const presignedPost = await createPresignedPost(s3Client, {
    Bucket: photosBucket,
    Key: `${sub}/fooBar`,
  });

  return [presignedPost];
};
