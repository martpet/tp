import { filterChangedProps } from '~/utils/filterChangedProps';

const oldProps = { a: 1, b: 1, c: 1 };
const newProps = { a: 2, b: 1, d: 1 };

describe('filterChangedProps', () => {
  it('returns props that are new or changed', () => {
    expect(filterChangedProps(newProps, oldProps)).toEqual({ a: 2, d: 1 });
  });

  it('returns "undefined" when no props are changed', () => {
    expect(filterChangedProps(newProps, newProps)).toBeUndefined();
  });
});
