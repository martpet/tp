export const createDynamoUpdateExpression = vi
  .fn()
  .mockName('createDynamoUpdateExpression')
  .mockReturnValue({
    ExpressionAttributeNames: 'dummyExpressionAttributeNames',
    ExpressionAttributeValues: 'dummyExpressionAttributeValues',
    UpdateExpression: 'dummyUpdateExpression',
  });
