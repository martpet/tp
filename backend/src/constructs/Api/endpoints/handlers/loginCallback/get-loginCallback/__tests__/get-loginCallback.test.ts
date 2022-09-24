import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { OauthCookieProps } from '~/constructs/Api/types';
import { itResolvesWithErrorResponse } from '~/constructs/Api/utils';

import { dummyOauthTokens } from '../__mocks__/fetchTokens';
import { dummyOauthCookieProps } from '../__mocks__/parseOauthCookie';
import { createSession } from '../createSession';
import { fetchTokens } from '../fetchTokens';
import { handler } from '../get-loginCallback';
import { parseOauthCookie } from '../parseOauthCookie';

vi.importMock('../createSession');

vi.mock('~/constructs/Api/utils/errorResponse');
vi.mock('../fetchTokens');
vi.mock('../parseOauthCookie');
vi.mock('../createSession');

const args = [
  {
    cookies: 'dummyCookies',
    queryStringParameters: {
      code: 'dummyCode',
      state: 'dummyState',
    },
  },
] as unknown as Parameters<APIGatewayProxyHandlerV2>;

beforeEach(() => {
  globalLambdaProps.envName = 'production';
  process.env.authDomain = 'dummyAuthDomain';
  process.env.clientId = 'dummyClientId';
  process.env.loginCallbackUrl = 'dummyLoginCallbackUrl';
  process.env.envName = 'dummyEnvName';
});

describe('"get-loginCallback" handler', () => {
  it('calls "parseOauthCookie" with correct args', async () => {
    await handler(...args);
    expect(vi.mocked(parseOauthCookie).mock.calls).toMatchSnapshot();
  });

  it('calls "fetchTokens" with correct args', async () => {
    await handler(...args);
    expect(vi.mocked(fetchTokens).mock.calls).toMatchSnapshot();
  });

  it('calls "createSession" with corrects args', async () => {
    await handler(...args);
    expect(vi.mocked(createSession).mock.calls).toMatchSnapshot();
  });

  it('resolves with a correct value', () => {
    return expect(handler(...args)).resolves.toMatchSnapshot();
  });

  describe.each(['code', 'state'])(
    'when "%s" query string parameter is missing',
    (key) => {
      const argsClone = structuredClone(args);
      const { queryStringParameters } = argsClone[0] as Required<typeof argsClone[0]>;
      delete queryStringParameters[key];
      itResolvesWithErrorResponse(handler, argsClone);
    }
  );

  describe.each(['clientId', 'authDomain', 'loginCallbackUrl'])(
    'when "%s" env var is missing',
    (key) => {
      beforeEach(() => {
        delete process.env[key];
      });
      itResolvesWithErrorResponse(handler, args);
    }
  );

  describe.each(['stateNonce', 'idTokenNonce', 'codeVerifier'])(
    'when "oauth" cookie content is missing "%s" key',
    (key) => {
      const oauthCookiePropsClone = structuredClone(dummyOauthCookieProps);
      delete oauthCookiePropsClone[key as keyof OauthCookieProps];
      beforeEach(() => {
        vi.mocked(parseOauthCookie).mockReturnValueOnce(oauthCookiePropsClone);
      });
      itResolvesWithErrorResponse(handler, args);
    }
  );

  describe('when "fetchTokens" rejects', () => {
    beforeEach(() => {
      vi.mocked(fetchTokens).mockRejectedValueOnce(new Error('dummyErrorMessage'));
    });
    itResolvesWithErrorResponse(handler, args);
  });

  describe('when "createSession" rejects', () => {
    beforeEach(() => {
      vi.mocked(createSession).mockRejectedValueOnce(new Error('dummyErrorMessage'));
    });
    itResolvesWithErrorResponse(handler, args);
  });

  describe('when "stateNonce" from "oauth" cookie does not match with "state" from query strings params', () => {
    const argsClone = structuredClone(args);
    const { queryStringParameters } = argsClone[0] as Required<typeof argsClone[0]>;
    queryStringParameters.state = 'differentState';
    itResolvesWithErrorResponse(handler, argsClone);
  });

  describe('when "idTokenNonce" from "oauth" cookie does not match with "nonce" from the "idToken" payload', () => {
    const tokensPropsClone = structuredClone(dummyOauthTokens);
    tokensPropsClone.idTokenPayload.nonce = 'differentNonce';
    beforeEach(() => {
      vi.mocked(fetchTokens).mockResolvedValueOnce(tokensPropsClone);
    });
    itResolvesWithErrorResponse(handler, args);
  });

  describe('when "globalLambdaProps.envName" is "personal"', () => {
    beforeEach(() => {
      globalLambdaProps.envName = 'personal';
    });
    it('resolves with a correct value', () => {
      return expect(handler(...args)).resolves.toMatchSnapshot();
    });
  });
});
