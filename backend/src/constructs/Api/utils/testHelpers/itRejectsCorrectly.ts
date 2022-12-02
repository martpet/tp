import { CallbackAndArgsTuple } from '~/types';

export function itRejectsCorrectly(...rest: CallbackAndArgsTuple) {
  const [handler, handlerArgs = []] = rest;

  it('rejects with a correct value', () => {
    return expect(handler(...handlerArgs)).rejects.toMatchSnapshot();
  });
}
