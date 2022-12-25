import { CallbackAndArgsTuple } from '~/types';

import { itResolvesWithError } from './itResolvesWithError';

export function itHasPathParam(pathParam: string, ...rest: CallbackAndArgsTuple) {
  const [handler, handlerArgs = []] = rest;

  describe(`when "${pathParam}" path parameter is missing`, () => {
    const argsClone = structuredClone(handlerArgs);
    argsClone[0].pathParameters[pathParam] = undefined;
    itResolvesWithError(handler, argsClone);
  });
}
