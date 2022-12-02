import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import cookie from 'cookie';

import { itHasEnvVars, itHasQueryStrings, itResolvesCorrectly } from '~/constructs/Api/utils';

import { handler } from '../get-login';

vi.mock('cookie');
vi.mock('~/constructs/Api/utils/errorResponse');
vi.mock('../generateOauthRandoms');

process.env.clientId = 'dummyClientId';
process.env.authDomain = 'dummyAuthDomain';
process.env.loginCallbackUrl = 'dummyLoginCallbackUrl';

const args = [
  {
    queryStringParameters: {
      provider: 'dummyProvider',
    },
  },
] as unknown as Parameters<APIGatewayProxyHandlerV2>;

describe('"get-login" handler', () => {
  itHasQueryStrings(['provider'], handler, args);
  itHasEnvVars(['authDomain', 'loginCallbackUrl', 'clientId'], handler, args);
  itResolvesCorrectly(handler, args);

  it('calls "cookie.serialize" with correct args', async () => {
    await handler(...args);
    expect(vi.mocked(cookie.serialize).mock.calls).toMatchSnapshot();
  });
});
