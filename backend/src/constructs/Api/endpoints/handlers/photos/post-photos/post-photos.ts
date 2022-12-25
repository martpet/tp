import {
  APIGatewayProxyHandlerV2,
  errorResponse,
  getIdTokenPayload,
  PostPhotosRequest,
  PostPhotosResponse,
  RouteHeaders,
  StatusCodes,
} from 'lambda-layer';

import { findExistingFingerprints } from '~/constructs/Api/utils';

import { createPhotoItems } from './createPhotoItems';

export const handler: APIGatewayProxyHandlerV2<PostPhotosResponse> = async (event) => {
  const { authorization } = event.headers as RouteHeaders<'/settings'>;

  if (!authorization) {
    return errorResponse('f31e4f94d3');
  }

  if (!event.body) {
    return errorResponse('24d59e00da', { statusCode: StatusCodes.BAD_REQUEST });
  }

  let requestData;

  try {
    requestData = JSON.parse(event.body) as PostPhotosRequest;
  } catch (error) {
    return errorResponse('d45458a241', { statusCode: StatusCodes.BAD_REQUEST, error });
  }

  const existingFingerprintsInDb = await findExistingFingerprints(
    requestData.map(({ fingerprint }) => fingerprint)
  );

  if (existingFingerprintsInDb.length) {
    return errorResponse('9082bdd5f9', {
      statusCode: StatusCodes.FORBIDDEN,
      description: 'Cannot replace existing item',
    });
  }

  const { sub } = await getIdTokenPayload(authorization);
  return createPhotoItems({ requestData, sub });
};
