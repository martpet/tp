export const createDynamoUpdateExpression = vi.fn().mockReturnValue({
  ExpressionAttributeNames: 'dummyExpressionAttributeNames',
  ExpressionAttributeValues: 'dummyExpressionAttributeValues',
  UpdateExpression: 'dummyUpdateExpression',
});
