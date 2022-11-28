import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';

import { ApiRouteHeaders, HandlerEnv } from '~/constructs/Api/types';
import { errorResponse, getIdTokenPayload } from '~/constructs/Api/utils';
import { maxPhotoUploadBytes } from '~/consts';
import {
  PostGenerateUploadUrlsRequestBody,
  PostGenerateUploadUrlsResponseBody,
} from '~/types';

const s3Client = new S3Client({});

export const handler: APIGatewayProxyHandlerV2<
  PostGenerateUploadUrlsResponseBody
> = async (event) => {
  const { authorization } = event.headers as ApiRouteHeaders<'/settings'>;
  const { photoBucket } = process.env as HandlerEnv<'/generate-upload-urls', 'POST'>;
  const dateString = new Date().toISOString();

  let items;

  if (!authorization) {
    return errorResponse('Vf5Ph6qN1S');
  }

  if (!photoBucket) {
    return errorResponse('1rQkj3kpp4');
  }

  if (!event.body) {
    return errorResponse('G-luuHqI0s', { statusCode: StatusCodes.BAD_REQUEST });
  }

  try {
    items = JSON.parse(event.body) as PostGenerateUploadUrlsRequestBody;
  } catch (error) {
    return errorResponse('9210145fdf', { statusCode: StatusCodes.BAD_REQUEST, error });
  }

  // check if photo item with same hash exists (global or only user ?)

  const { sub } = getIdTokenPayload(authorization);

  return Promise.all(
    items.map(async ({ id, hash }) => ({
      id,
      presignedPost: await createPresignedPost(s3Client, {
        Bucket: photoBucket,
        Key: `${sub}/${dateString}/${hash}.jpg`,
        Expires: 60,
        Conditions: [['content-length-range', 0, maxPhotoUploadBytes]],
      }),
    }))
  );
};
