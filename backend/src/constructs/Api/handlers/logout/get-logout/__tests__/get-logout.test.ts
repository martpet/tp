import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import cookie from 'cookie';

import { itResolvesWithApiError } from '../../../../apiUtils';
import { deleteSession } from '../deleteSession';
import { handler } from '../get-logout';
import { parseSessionCookie } from '../parseSessionCookie';
import { revokeOauthTokens } from '../revokeOauthTokens';

vi.mock('cookie');
vi.mock('../deleteSession');
vi.mock('../parseSessionCookie');
vi.mock('../revokeOauthTokens');
vi.mock('../../../../apiUtils/errorResponse');

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
  process.env.logoutCallbackLocalhostUrl = 'dummyLogoutCallbackLocalhostUrl';
  process.env.envName = 'dummyEnvName';
});

describe('"get-logout" handler', () => {
  it('calls "cookie.serialize" with correct args', async () => {
    await handler(...args);
    expect(vi.mocked(cookie.serialize).mock.calls).toMatchSnapshot();
  });

  it('resolves with a correct value', () => {
    return expect(handler(...args)).resolves.toMatchSnapshot();
  });

  describe('when "parseSessionCookie" returns a value', () => {
    beforeEach(() => {
      vi.mocked(parseSessionCookie).mockReturnValueOnce('dummySessionId');
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
      itResolvesWithApiError(handler, args);
    });

    describe('when "revokeOauthTokens" rejects', () => {
      beforeEach(() => {
        vi.mocked(revokeOauthTokens).mockRejectedValueOnce(
          'dummyRevokeOauthTokensRejectedValue'
        );
      });
      itResolvesWithApiError(handler, args);
    });
  });

  describe('when "envName" is "personal"', () => {
    beforeEach(() => {
      process.env.envName = 'personal';
    });

    describe('when "referer" header is missing', () => {
      const argsClone = structuredClone(args);
      delete argsClone[0].headers.referer;

      itResolvesWithApiError(handler, argsClone);
    });

    describe('when "referer" is from localhost', () => {
      const argsClone = structuredClone(args);
      argsClone[0].headers.referer = 'http://localhost:3000/dummyPath';

      it('resolves with a correct value', () => {
        return expect(handler(...argsClone)).resolves.toMatchSnapshot();
      });
    });
  });

  describe.each([
    'authDomain',
    'clientId',
    'logoutCallbackUrl',
    'logoutCallbackLocalhostUrl',
    'envName',
  ])('when "%s" env var is missing', (key) => {
    beforeEach(() => {
      delete process.env[key];
    });
    itResolvesWithApiError(handler, args);
  });
});
