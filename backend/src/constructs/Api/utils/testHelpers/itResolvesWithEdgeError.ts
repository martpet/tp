import { itCalls, itResolves, lambdaEdgeErrorResponse } from '~/constructs/Api/utils';
import { CallbackAndArgsTuple } from '~/types';

export function itResolvesWithEdgeError(...rest: CallbackAndArgsTuple) {
  const [handler, handlerArgs = []] = rest;
  itCalls(lambdaEdgeErrorResponse, handler, handlerArgs);
  itResolves(handler, handlerArgs);
}
