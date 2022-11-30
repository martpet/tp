import {
  APIGatewayProxyHandlerV2,
  ApiRouteHeaders,
  createPresignedPost,
  errorResponse,
  getIdTokenPayload,
  HandlerEnv,
  maxPhotoUploadBytes,
  PostGenerateUploadUrlsRequestBody,
  PostGenerateUploadUrlsResponseBody,
  S3Client,
  StatusCodes,
} from 'lambda-layer';

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

  const { sub } = await getIdTokenPayload(authorization);

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
