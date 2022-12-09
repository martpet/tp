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

import { findExistingFingerPrints } from './findExistingFingerPrints';

const s3Client = new S3Client({});

export const handler: APIGatewayProxyHandlerV2<PostGenerateUploadUrlsResponse> = async (
  event
) => {
  const { authorization } = event.headers as ApiRouteHeaders<'/settings'>;
  const { photoBucket } = process.env as HandlerEnv<'/generate-upload-urls', 'POST'>;
  let requestItems;
  let existingFingerprintsInDb: string[];

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
    requestItems = JSON.parse(event.body) as PostGenerateUploadUrlsRequest;
  } catch (error) {
    return errorResponse('9210145fdf', { statusCode: StatusCodes.BAD_REQUEST, error });
  }

  try {
    const fingerprints = requestItems.map(({ fingerprint }) => fingerprint);
    existingFingerprintsInDb = await findExistingFingerPrints(fingerprints);
  } catch (error) {
    return errorResponse('9fb96f4182', { error });
  }

  const uniqueItems = requestItems.filter(
    ({ fingerprint }) => !existingFingerprintsInDb.includes(fingerprint)
  );
  const { sub } = await getIdTokenPayload(authorization);

  const uploadUrlsEntries = await Promise.all(
    uniqueItems.map(async ({ id, fingerprint, digest }) => {
      const presignedPost = await createPresignedPost(s3Client, {
        Bucket: photoBucket,
        Key: `${sub}/${fingerprint}.jpg`,
        Expires: uniqueItems.length * 10,
        Fields: {
          'x-amz-checksum-algorithm': 'SHA256',
          'x-amz-checksum-sha256': digest,
        },
        Conditions: [['content-length-range', 0, maxPhotoUploadSize]],
      });
      return [id, presignedPost];
    })
  );

  return {
    presignedPosts: Object.fromEntries(uploadUrlsEntries),
    existingFingerprintsInDb,
  };
};
