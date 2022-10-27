import { CallbackAndArgsTuple } from '~/types';

export const itRejects = (...rest: CallbackAndArgsTuple) => {
  const [callback, callbackArgs = []] = rest;

  it('rejects with a correct value', () => {
    return expect(callback(...callbackArgs)).rejects.toMatchSnapshot();
  });
};
