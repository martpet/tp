import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { getIdTokenPayload, itResolvesWithErrorResponse } from '~/constructs/Api/utils';
import { Me } from '~/types';

import { handler } from '../get-me';

vi.mock('~/constructs/Api/utils/errorResponse');
vi.mock('~/constructs/Api/utils/getIdTokenPayload');

const args = [
  {
    headers: {
      authorization: 'dummyIdToken',
    },
  },
] as unknown as Parameters<APIGatewayProxyHandlerV2<Me>>;

describe('get-me', () => {
  it('calls "getIdTokenPayload" with correct args', async () => {
    await handler(...args);
    expect(vi.mocked(getIdTokenPayload).mock.calls).toMatchSnapshot();
  });

  it('resolves with a correct value', () => {
    return expect(handler(...args)).resolves.toMatchSnapshot();
  });

  describe('when "authorization" header is missing', () => {
    const argsClone = structuredClone(args);
    argsClone[0].headers.authorization = undefined;

    itResolvesWithErrorResponse(handler, argsClone);
  });
});
