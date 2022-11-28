import { CallbackAndArgsTuple } from '~/types';

export function itResolves(...rest: CallbackAndArgsTuple) {
  const [handler, handlerArgs = []] = rest;

  it('resolves with a correct value', () => {
    return expect(handler(...handlerArgs)).resolves.toMatchSnapshot();
  });
}
