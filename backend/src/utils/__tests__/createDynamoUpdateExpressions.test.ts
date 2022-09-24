import { createDynamoUpdateExpression } from '~/utils/createDynamoUpdateExpression';

const args = [{ param1: 'param1Value' }] as const;

describe('createDynamoUpdateExpression', () => {
  it('returns a correct value', () => {
    expect(createDynamoUpdateExpression(...args)).toMatchSnapshot();
  });
});
