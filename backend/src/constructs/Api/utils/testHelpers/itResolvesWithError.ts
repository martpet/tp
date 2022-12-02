import { errorResponse, itResolvesCorrectly } from '~/constructs/Api/utils';
import { CallbackAndArgsTuple } from '~/types';

export function itResolvesWithError(...rest: CallbackAndArgsTuple) {
  const [handler, handlerArgs = []] = rest;

  it('calls "errorResponse" with correct args', async () => {
    await handler(...handlerArgs);
    expect(vi.mocked(errorResponse).mock.calls).toMatchSnapshot();
  });

  itResolvesCorrectly(handler, handlerArgs);
}
