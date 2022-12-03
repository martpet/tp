import {
  APIGatewayProxyHandlerV2,
  ApiRouteHeaders,
  createPresignedPost,
  errorResponse,
  getIdTokenPayload,
  HandlerEnv,
  maxPhotoUploadSize,
  PostGenerateUploadUrlsRequest,
  PostGenerateUploadUrlsResponse,
  S3Client,
  StatusCodes,
} from 'lambda-layer';

import { findExistingItems } from './findExistingItems';

const s3Client = new S3Client({});

export const handler: APIGatewayProxyHandlerV2<PostGenerateUploadUrlsResponse> = async (
  event
) => {
  const { authorization } = event.headers as ApiRouteHeaders<'/settings'>;
  const { photoBucket } = process.env as HandlerEnv<'/generate-upload-urls', 'POST'>;
  const dateString = new Date().toISOString();
  let items;
  let existingItemsInDb: string[];

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
    items = JSON.parse(event.body) as PostGenerateUploadUrlsRequest;
  } catch (error) {
    return errorResponse('9210145fdf', { statusCode: StatusCodes.BAD_REQUEST, error });
  }

  try {
    existingItemsInDb = await findExistingItems(items);
  } catch (error) {
    return errorResponse('9fb96f4182', { error });
  }

  const newItems = items.filter((hash) => !existingItemsInDb.includes(hash));
  const { sub } = await getIdTokenPayload(authorization);

  const uploadUrlsEntries = await Promise.all(
    newItems.map(async (hash) => {
      const presignedPost = await createPresignedPost(s3Client, {
        Bucket: photoBucket,
        Key: `${sub}/${dateString}/${hash}.jpg`,
        Expires: 60,
        Conditions: [['content-length-range', 0, maxPhotoUploadSize]],
      });
      return [hash, presignedPost];
    })
  );

  return {
    uploadUrls: Object.fromEntries(uploadUrlsEntries),
    existingItemsInDb,
  };
};
