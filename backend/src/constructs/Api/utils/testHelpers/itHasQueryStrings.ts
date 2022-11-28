import { CallbackAndArgsTuple } from '~/types';

import { itResolvesWithError } from './itResolvesWithError';

export function itHasQueryStrings(keys: string[], ...rest: CallbackAndArgsTuple) {
  const [handler, handlerArgs = []] = rest;

  describe.each(keys)('when "%s" query string parameter is missing', (key) => {
    const argsClone = structuredClone(handlerArgs);
    const { queryStringParameters } = argsClone[0];

    delete queryStringParameters[key];

    itResolvesWithError(handler, argsClone);
  });
}
