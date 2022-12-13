import {
  APIGatewayProxyHandlerV2,
  ApiRouteHeaders,
  createPresignedPost,
  errorResponse,
  findExistingFingerprints,
  getIdTokenPayload,
  HandlerEnv,
  maxPhotoUploadSize,
  PostUploadUrlsRequest,
  PostUploadUrlsResponse,
  S3Client,
  StatusCodes,
} from 'lambda-layer';

const s3Client = new S3Client({});

export const handler: APIGatewayProxyHandlerV2<PostUploadUrlsResponse> = async (
  event
) => {
  const { authorization } = event.headers as ApiRouteHeaders<'/settings'>;
  const { photoBucket } = process.env as HandlerEnv<'/upload-urls', 'POST'>;

  if (!authorization) {
    return errorResponse('Vf5Ph6qN1S');
  }

  if (!photoBucket) {
    return errorResponse('1rQkj3kpp4');
  }

  if (!event.body) {
    return errorResponse('G-luuHqI0s', { statusCode: StatusCodes.BAD_REQUEST });
  }

  let requestData;

  try {
    requestData = JSON.parse(event.body) as PostUploadUrlsRequest;
  } catch (error) {
    return errorResponse('9210145fdf', { statusCode: StatusCodes.BAD_REQUEST, error });
  }

  const existingFingerprintsInDb = await findExistingFingerprints(
    requestData.map(({ fingerprint }) => fingerprint)
  );

  const uniqueItems = requestData.filter(
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
