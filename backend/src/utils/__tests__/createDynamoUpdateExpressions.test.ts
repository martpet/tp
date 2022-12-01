import { itReturns } from 'lambda-layer';

import { createDynamoUpdateExpression } from '~/utils/createDynamoUpdateExpression';

const args: Parameters<typeof createDynamoUpdateExpression> = [
  {
    param1: 'param1Value',
    param2: 'param2Value',
  },
];

const argsWithParentKey = [...args, 'dummyParentKey'] as unknown as Parameters<
  typeof createDynamoUpdateExpression
>;

describe('createDynamoUpdateExpression', () => {
  itReturns(createDynamoUpdateExpression, args);

  describe('when parent key is provided', () => {
    itReturns(createDynamoUpdateExpression, argsWithParentKey);
  });
});
