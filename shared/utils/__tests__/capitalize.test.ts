import { capitalize } from '../capitalize';

describe('capitalize', () => {
  it('return a correct value', () => {
    expect(capitalize('foo')).toBe('Foo');
  });
});
