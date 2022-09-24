import clone from 'clone';
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

    if (checkIsPublicEndpoint(event)) {
      return request;
    }

    const { sessionId } = parseLambdaEdgeEventCookies(event);

    if (!sessionId) {
      throw new Error('missing session id');
    }

    const requestClone = clone(request); // https://github.com/facebook/jest/issues/7950
    requestClone.headers.authorization = [{ value: await getIdToken(sessionId) }];
    return requestClone;
  } catch (error) {
    return lambdaEdgeErrorResponse('eWUjcKPBi3', {
      statusCode: StatusCodes.UNAUTHORIZED,
      error,
    });
  }
};
