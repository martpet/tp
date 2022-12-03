import { getIdTokenPayload, itCalls } from '~/constructs/Api/utils';
import { CallbackAndArgsTuple } from '~/types';

import { itResolvesWithError } from './itResolvesWithError';

export function itGetsIdToken(...rest: CallbackAndArgsTuple) {
  const [callback, callbackArgs = []] = rest;

  itCalls(getIdTokenPayload, callback, callbackArgs);

  describe('when "authorization" header is missing', () => {
    const argsClone = structuredClone(callbackArgs);
    argsClone[0].headers.authorization = undefined;
    itResolvesWithError(callback, argsClone);
  });
}
