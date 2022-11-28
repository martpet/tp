import { getIdTokenPayload } from '~/constructs/Api/utils';
import { CallbackAndArgsTuple } from '~/types';

import { itResolvesWithError } from './itResolvesWithError';

export function itGetsIdToken(...rest: CallbackAndArgsTuple) {
  const [handler, handlerArgs = []] = rest;

  it('calls "getIdTokenPayload" with correct args', async () => {
    await handler(...handlerArgs);
    expect(vi.mocked(getIdTokenPayload).mock.calls).toMatchSnapshot();
  });

  describe('when "authorization" header is missing', () => {
    const argsClone = structuredClone(handlerArgs);
    argsClone[0].headers.authorization = undefined;
    itResolvesWithError(handler, argsClone);
  });
}
