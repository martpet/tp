import { lambdaEdgeViewerEvent } from '~/constructs/Api/consts';
import { LambdaEdgeViewerRequestHandler } from '~/constructs/Api/types';
import {
  itCalls,
  itResolves,
  itResolvesWithEdgeError,
  parseLambdaEdgeEventCookies,
} from '~/constructs/Api/utils';

import { handler } from '../authEdgeHandler';
import { checkIsPublicEndpoint } from '../checkIsPublicEndpoint';
import { getIdToken } from '../getIdToken';

vi.mock('../checkIsPublicEndpoint');
vi.mock('../getIdToken');
vi.mock('~/constructs/Api/utils/parseLambdaEdgeEventCookies');
vi.mock('~/constructs/Api/utils/lambdaEdgeErrorResponse');

const args = [lambdaEdgeViewerEvent] as Parameters<LambdaEdgeViewerRequestHandler>;

vi.mocked(checkIsPublicEndpoint).mockReturnValue(false);
vi.mocked(parseLambdaEdgeEventCookies).mockReturnValue({
  sessionId: 'dummySessionId',
});

describe('authEdgeHandler', () => {
  itResolves(handler, args);
  itCalls(parseLambdaEdgeEventCookies, handler, args);
  itCalls(checkIsPublicEndpoint, handler, args);
  itCalls(getIdToken, handler, args);

  describe('when the endpoint is public', () => {
    beforeEach(() => {
      vi.mocked(checkIsPublicEndpoint).mockReturnValueOnce(true);
    });
    itResolves(handler, args);
  });

  describe('when the request method is "OPTIONS"', () => {
    const argsClone = structuredClone(args);
    argsClone[0].Records[0].cf.request.method = 'OPTIONS';
    itResolves(handler, argsClone);
  });

  describe('when "sessionId" is missing', () => {
    beforeEach(() => {
      vi.mocked(parseLambdaEdgeEventCookies).mockReturnValueOnce({});
    });
    itResolvesWithEdgeError(handler, args);
  });

  describe('when "getIdToken" rejects', () => {
    beforeEach(() => {
      vi.mocked(getIdToken).mockRejectedValueOnce(
        new Error('dummy getIdToken error message')
      );
    });
    itResolvesWithEdgeError(handler, args);
  });
});
