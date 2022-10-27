import { getIdTokenPayload } from '~/constructs/Api/utils';
import { CallbackAndArgsTuple } from '~/types';

import { itResolvesWithError } from './itResolvesWithError';

export const itGetsIdTokenPayload = (...rest: CallbackAndArgsTuple) => {
  const [callback, callbackArgs = []] = rest;

  it('calls "getIdTokenPayload" with correct args', async () => {
    await callback(...callbackArgs);
    expect(vi.mocked(getIdTokenPayload).mock.calls).toMatchSnapshot();
  });

  describe('when "authorization" header is missing', () => {
    const argsClone = structuredClone(callbackArgs);
    argsClone[0].headers.authorization = undefined;
    itResolvesWithError(callback, argsClone);
  });
};
