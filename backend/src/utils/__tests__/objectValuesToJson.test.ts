import { itReturnsCorrectly } from 'lambda-layer';

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
  itReturnsCorrectly(objectValuesToJson, args);
});
