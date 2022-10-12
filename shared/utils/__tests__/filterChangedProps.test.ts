import { filterChangedProps } from '../filterChangedProps';

describe('lowercase', () => {
  it('return a correct value', () => {
    expect(
      filterChangedProps({ a: 'a', b: 'b2', d: 'd' }, { a: 'a', b: 'b', c: 'c' })
    ).toMatchSnapshot();
  });

  it('return a correct value when no props are changed', () => {
    expect(filterChangedProps({ a: 'a' }, { a: 'a' })).toMatchSnapshot();
  });
});
