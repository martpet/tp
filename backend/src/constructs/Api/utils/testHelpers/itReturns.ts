import { CallbackAndArgsTuple } from '~/types';

export function itReturns(...rest: CallbackAndArgsTuple) {
  const [callback, calbackArgs = []] = rest;

  it('returns a correct value', () => {
    expect(callback(...calbackArgs)).toMatchSnapshot();
  });
}
