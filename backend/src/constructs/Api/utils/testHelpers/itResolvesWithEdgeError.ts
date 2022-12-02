import { itResolvesCorrectly, lambdaEdgeErrorResponse } from '~/constructs/Api/utils';
import { CallbackAndArgsTuple } from '~/types';

export function itResolvesWithEdgeError(...rest: CallbackAndArgsTuple) {
  const [handler, handlerArgs = []] = rest;

  it('calls "lambdaEdgeErrorResponse" with correct args', async () => {
    await handler(...handlerArgs);
    expect(vi.mocked(lambdaEdgeErrorResponse).mock.calls).toMatchSnapshot();
  });

  itResolvesCorrectly(handler, handlerArgs);
}
