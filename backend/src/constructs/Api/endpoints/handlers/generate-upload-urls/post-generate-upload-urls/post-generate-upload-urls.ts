import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';

import { ApiRouteHeaders, HandlerEnv } from '~/constructs/Api/types';
import { errorResponse, getIdTokenPayload } from '~/constructs/Api/utils';
import { maxPhotoUploadBytes } from '~/consts';
import { PostGenerateUploadUrlsResponse } from '~/types';

const s3Client = new S3Client({});

export const handler: APIGatewayProxyHandlerV2<PostGenerateUploadUrlsResponse> = async (
  event
) => {
  const { authorization } = event.headers as ApiRouteHeaders<'/settings'>;
  const { photoBucket } = process.env as HandlerEnv<'/generate-upload-urls', 'POST'>;
  const itemsCount = Number(event.body);
  const dateIso = new Date().toISOString();

  if (!event.body || typeof itemsCount !== 'number') {
    return errorResponse('G-luuHqI0s', { statusCode: StatusCodes.BAD_REQUEST });
  }

  if (!authorization) {
    return errorResponse('Vf5Ph6qN1S');
  }

  if (!photoBucket) {
    return errorResponse('1rQkj3kpp4');
  }

  // check if photo item with same hash exists (global or only user ?)

  const { sub } = getIdTokenPayload(authorization);

  const promises = [];

  for (let step = 1; step <= itemsCount; step++) {
    promises.push(
      createPresignedPost(s3Client, {
        Bucket: photoBucket,
        Key: `${sub}/${dateIso}/${step}.jpg`,
        Expires: 60,
        Conditions: [['content-length-range', 0, maxPhotoUploadBytes]],
      })
    );
  }

  return Promise.all(promises);
};
