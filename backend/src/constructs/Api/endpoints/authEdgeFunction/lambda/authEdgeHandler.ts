import { StatusCodes } from 'http-status-codes';

import { LambdaEdgeViewerRequestHandler } from '~/constructs/Api/types';
import {
  lambdaEdgeErrorResponse,
  parseLambdaEdgeEventCookies,
} from '~/constructs/Api/utils';

import { checkIsPublicEndpoint } from './checkIsPublicEndpoint';
import { getIdToken } from './getIdToken';

export const handler: LambdaEdgeViewerRequestHandler = async (event) => {
  try {
    const { request } = event.Records[0].cf;
    delete request.headers.authorization;

    if (request.method === 'OPTIONS') {
      return { status: StatusCodes.NO_CONTENT };
    }

    if (checkIsPublicEndpoint(event)) {
      return request;
    }

    const { sessionId } = parseLambdaEdgeEventCookies(event);

    if (!sessionId) {
      throw new Error('invalid or missing `sessionId` cookie');
    }

    const requestClone = structuredClone(request);
    // https://github.com/facebook/jest/issues/7950

    requestClone.headers.authorization = [{ value: await getIdToken(sessionId) }];
    return requestClone;
  } catch (error) {
    return lambdaEdgeErrorResponse('eWUjcKPBi3', {
      statusCode: StatusCodes.UNAUTHORIZED,
      error,
    });
  }
};
