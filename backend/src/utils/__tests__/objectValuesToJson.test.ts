import { objectValuesToJson } from '../objectValuesToJson';

const args = [
  {
    string: '1',
    number: 1,
    array: ['a'],
    object: { foo: 'bar' },
  },
] as Parameters<typeof objectValuesToJson>;

describe('objectValuesToJson', () => {
  it('returns a correct value', () => {
    expect(objectValuesToJson(...args)).toMatchSnapshot();
  });
});
