import { CallbackAndArgsTuple } from '~/types';

export function itReturnsCorrectly(...rest: CallbackAndArgsTuple) {
  const [callback, calbackArgs = []] = rest;

  it('returns a correct value', () => {
    expect(callback(...calbackArgs)).toMatchSnapshot();
  });
}
