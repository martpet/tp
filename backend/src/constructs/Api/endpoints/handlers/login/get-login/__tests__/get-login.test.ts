import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import cookie from 'cookie';

import { itResolvesWithErrorResponse } from '~/constructs/Api/utils';

import { handler } from '../get-login';

vi.mock('cookie');
vi.mock('~/constructs/Api/utils/errorResponse');
vi.mock('../generateOauthRandoms');

const args = [
  {
    queryStringParameters: {
      provider: 'dummyProvider',
    },
  },
] as unknown as Parameters<APIGatewayProxyHandlerV2>;

beforeEach(() => {
  process.env.clientId = 'dummyClientId';
  process.env.authDomain = 'dummyAuthDomain';
  process.env.loginCallbackUrl = 'dummyLoginCallbackUrl';
});

describe('"get-login" handler', () => {
  it('calls "cookie.serialize" with correct args', async () => {
    await handler(...args);
    expect(vi.mocked(cookie.serialize).mock.calls).toMatchSnapshot();
  });

  it('resolves with a correct value', () => {
    return expect(handler(...args)).resolves.toMatchSnapshot();
  });

  describe.each(['provider'])('when "%s" query string parameter is missing', (key) => {
    const argsClone = structuredClone(args);
    const { queryStringParameters } = argsClone[0] as Required<typeof argsClone[0]>;
    delete queryStringParameters[key];
    itResolvesWithErrorResponse(handler, argsClone);
  });

  describe.each(['authDomain', 'loginCallbackUrl', 'clientId'])(
    'when "%s" env var is missing',
    (key) => {
      beforeEach(() => {
        delete process.env[key];
      });
      itResolvesWithErrorResponse(handler, args);
    }
  );
});