import { CallbackAndArgsTuple } from '~/types';

export function itCalls(fn: (...args: any[]) => unknown, ...rest: CallbackAndArgsTuple) {
  const [callback, callbackArgs = []] = rest;

  it(`calls "${vi.mocked(fn).getMockName()}" with correct args`, async () => {
    await callback(...callbackArgs);
    expect(vi.mocked(fn).mock.calls).toMatchSnapshot();
  });
}
