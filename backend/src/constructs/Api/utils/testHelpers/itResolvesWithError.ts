import { errorResponse, itCalls, itResolves } from '~/constructs/Api/utils';
import { CallbackAndArgsTuple } from '~/types';

export function itResolvesWithError(...rest: CallbackAndArgsTuple) {
  const [handler, handlerArgs = []] = rest;
  itCalls(errorResponse, handler, handlerArgs);
  itResolves(handler, handlerArgs);
}
