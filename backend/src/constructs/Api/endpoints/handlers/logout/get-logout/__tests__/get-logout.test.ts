import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import {
  itCalls,
  itHasEnvVars,
  itResolves,
  itResolvesWithError,
  parseEventCookies,
} from '~/constructs/Api/utils';

import { deleteSession } from '../deleteSession';
import { handler } from '../get-logout';
import { revokeOauthTokens } from '../revokeOauthTokens';

vi.mock('../deleteSession');
vi.mock('../revokeOauthTokens');
vi.mock('~/constructs/Api/utils/parseEventCookies');
vi.mock('~/constructs/Api/utils/errorResponse');

process.env.authDomain = 'dummyAuthDomain';
process.env.clientId = 'dummyClientId';
process.env.logoutCallbackUrl = 'dummyLogoutCallbackUrl';
process.env.logoutCallbackLocalhostUrl = 'dummyLocalhostLogoutCallbackUrl';

const args = [
  {
    cookies: 'dummyCookies',
    headers: {
      referer: 'dummyRefererHeader',
    },
  },
] as unknown as Parameters<APIGatewayProxyHandlerV2>;

describe('"get-logout" handler', () => {
  itHasEnvVars(
    ['authDomain', 'clientId', 'logoutCallbackUrl', 'logoutCallbackLocalhostUrl'],
    handler,
    args
  );
  itCalls(parseEventCookies, handler, args);
  itResolves(handler, args);

  describe('when "parseEventCookies" returns a "sessionId"', () => {
    beforeEach(() => {
      vi.mocked(parseEventCookies).mockReturnValueOnce({ sessionId: 'dummySessionId' });
    });
    itCalls(deleteSession, handler, args);
    itCalls(revokeOauthTokens, handler, args);

    describe('when "deleteSession" rejects', () => {
      beforeEach(() => {
        const error = new Error('dummyDeleteSessionRejectedValue');
        vi.mocked(deleteSession).mockRejectedValueOnce(error);
      });
      itResolvesWithError(handler, args);
    });

    describe('when "revokeOauthTokens" rejects', () => {
      beforeEach(() => {
        const error = new Error('dummyRevokeOauthTokensRejectedValue');
        vi.mocked(revokeOauthTokens).mockRejectedValueOnce(error);
      });
      itResolvesWithError(handler, args);
    });
  });

  describe('when "globalLambdaProps.envName" is "personal"', () => {
    const initialEnvName = globalLambdaProps.envName;
    beforeAll(() => {
      globalLambdaProps.envName = 'personal';
    });
    afterAll(() => {
      globalLambdaProps.envName = initialEnvName;
    });
    describe('when "referer" header is missing', () => {
      const argsClone = structuredClone(args);
      delete argsClone[0].headers.referer;
      itResolvesWithError(handler, argsClone);
    });
    describe('when "referer" is from localhost', () => {
      const argsClone = structuredClone(args);
      argsClone[0].headers.referer = 'http://localhost:3000/dummyPath';
      itResolves(handler, argsClone);
    });
  });
});
