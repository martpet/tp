import { errorResponse, itResolves } from '~/constructs/Api/utils';
import { CallbackAndArgsTuple } from '~/types';

export const itResolvesWithError = (...rest: CallbackAndArgsTuple) => {
  const [callback, callbackArgs = []] = rest;

  it('calls "errorResponse" with correct args', async () => {
    await callback(...callbackArgs);
    expect(vi.mocked(errorResponse).mock.calls).toMatchSnapshot();
  });

  itResolves(callback, callbackArgs);
};
