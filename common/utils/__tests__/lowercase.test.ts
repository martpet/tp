import { lowercase } from '../lowercase';

describe('lowercase', () => {
  it('return a correct value', () => {
    expect(lowercase('Foo')).toBe('foo');
  });
});
