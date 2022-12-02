import { lambdaEdgeViewerEvent } from '~/constructs/Api/consts';
import { LambdaEdgeViewerRequestHandler } from '~/constructs/Api/types';
import {
  itResolvesCorrectly,
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
  itResolvesCorrectly(handler, args);

  it('calls "parseLambdaEdgeEventCookies" with correct args', async () => {
    await handler(...args);
    expect(vi.mocked(parseLambdaEdgeEventCookies).mock.calls).toMatchSnapshot();
  });

  it('calls "checkIsPublicEndpoint" with correct args', async () => {
    await handler(...args);
    expect(vi.mocked(checkIsPublicEndpoint).mock.calls).toMatchSnapshot();
  });

  it('calls "getIdToken" with correct args', async () => {
    await handler(...args);
    expect(vi.mocked(getIdToken).mock.calls).toMatchSnapshot();
  });

  describe('when the endpoint is public', () => {
    beforeEach(() => {
      vi.mocked(checkIsPublicEndpoint).mockReturnValueOnce(true);
    });
    it('resolved with a correct value', () => {
      return expect(handler(...args)).resolves.toMatchSnapshot();
    });
  });

  describe('when the request method is "OPTIONS"', () => {
    const argsClone = structuredClone(args);
    argsClone[0].Records[0].cf.request.method = 'OPTIONS';

    it('resolved with a correct value', () => {
      return expect(handler(...argsClone)).resolves.toMatchSnapshot();
    });
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
