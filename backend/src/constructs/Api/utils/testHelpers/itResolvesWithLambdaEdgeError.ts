import { itResolves, lambdaEdgeErrorResponse } from '~/constructs/Api/utils';
import { CallbackAndArgsTuple } from '~/types';

export const itResolvesWithLambdaEdgeError = (...rest: CallbackAndArgsTuple) => {
  const [callback, callbackArgs = []] = rest;

  it('calls "lambdaEdgeErrorResponse" with correct args', async () => {
    await callback(...callbackArgs);
    expect(vi.mocked(lambdaEdgeErrorResponse).mock.calls).toMatchSnapshot();
  });

  itResolves(callback, callbackArgs);
};
