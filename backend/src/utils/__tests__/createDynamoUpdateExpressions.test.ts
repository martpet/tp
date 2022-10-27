import { createDynamoUpdateExpression } from '~/utils/createDynamoUpdateExpression';

const args = [
  {
    param1: 'param1Value',
    param2: 'param2Value',
  },
] as const;

const argsWithParentKey = [...args, 'dummyParentKey'] as const;

describe('createDynamoUpdateExpression', () => {
  it('returns a correct value', () => {
    expect(createDynamoUpdateExpression(...args)).toMatchSnapshot();
  });

  it('returns a correct value when parent key is provided', () => {
    expect(createDynamoUpdateExpression(...argsWithParentKey)).toMatchSnapshot();
  });
});
