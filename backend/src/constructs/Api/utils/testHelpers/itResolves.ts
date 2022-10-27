import { CallbackAndArgsTuple } from '~/types';

export const itResolves = (...rest: CallbackAndArgsTuple) => {
  const [callback, callbackArgs = []] = rest;

  it('resolves with a correct value', () => {
    return expect(callback(...callbackArgs)).resolves.toMatchSnapshot();
  });
};
