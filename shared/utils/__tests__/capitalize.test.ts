import { capitalize } from '~/utils/capitalize';

describe('capitalize', () => {
  it('returns a correct value', () => {
    expect(capitalize('foo')).toBe('Foo');
  });
});
