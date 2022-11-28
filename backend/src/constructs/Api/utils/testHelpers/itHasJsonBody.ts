import { CallbackAndArgsTuple } from '~/types';

import { itResolvesWithError } from './itResolvesWithError';

export function itHasJsonBody(...rest: CallbackAndArgsTuple) {
  const [handler, args = []] = rest;

  describe('when "event.body" is missing', () => {
    const argsClone = structuredClone(args);
    argsClone[0].body = undefined;
    itResolvesWithError(handler, argsClone);
  });

  describe('when "event.body" is not JSON', () => {
    const argsClone = structuredClone(args);
    argsClone[0].body = 'not json';
    itResolvesWithError(handler, argsClone);
  });
}
