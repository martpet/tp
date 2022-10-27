import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import {
  itResolves,
  itResolvesWithError,
  parseEventCookies,
} from '~/constructs/Api/utils';

import { deleteSession } from '../deleteSession';
import { handler } from '../get-logout';
import { revokeOauthTokens } from '../revokeOauthTokens';

vi.mock('../deleteSession');
vi.mock('../revokeOauthTokens');
vi.mock('~/constructs/Api/utils/errorResponse');
vi.mock('~/constructs/Api/utils/parseEventCookies');

const args = [
  {
    cookies: 'dummyCookies',
    headers: {
      referer: 'dummyRefererHeader',
    },
  },
] as unknown as Parameters<APIGatewayProxyHandlerV2>;

beforeEach(() => {
  process.env.authDomain = 'dummyAuthDomain';
  process.env.clientId = 'dummyClientId';
  process.env.logoutCallbackUrl = 'dummyLogoutCallbackUrl';
  process.env.logoutCallbackLocalhostUrl = 'dummyLocalhostLogoutCallbackUrl';
});

describe('"get-logout" handler', () => {
  it('calls "parseEventCookies" with correct args', async () => {
    await handler(...args);
    expect(vi.mocked(parseEventCookies).mock.calls).toMatchSnapshot();
  });

  itResolves(handler, args);

  describe('when "parseEventCookies" returns a "sessionId"', () => {
    beforeEach(() => {
      vi.mocked(parseEventCookies).mockReturnValueOnce({
        sessionId: 'dummySessionId',
      });
    });

    it('calls "deleteSession" with correct args', async () => {
      await handler(...args);
      expect(vi.mocked(deleteSession).mock.calls).toMatchSnapshot();
    });

    it('calls "revokeOauthTokens" with correct args', async () => {
      await handler(...args);
      expect(vi.mocked(revokeOauthTokens).mock.calls).toMatchSnapshot();
    });

    describe('when "deleteSession" rejects', () => {
      beforeEach(() => {
        vi.mocked(deleteSession).mockRejectedValueOnce('dummyDeleteSessionRejectedValue');
      });
      itResolvesWithError(handler, args);
    });

    describe('when "revokeOauthTokens" rejects', () => {
      beforeEach(() => {
        vi.mocked(revokeOauthTokens).mockRejectedValueOnce(
          'dummyRevokeOauthTokensRejectedValue'
        );
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

  describe.each([
    'authDomain',
    'clientId',
    'logoutCallbackUrl',
    'logoutCallbackLocalhostUrl',
  ])('when "%s" env var is missing', (key) => {
    beforeEach(() => {
      delete process.env[key];
    });
    itResolvesWithError(handler, args);
  });
});
