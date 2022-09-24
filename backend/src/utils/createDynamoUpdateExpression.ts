export const createDynamoUpdateExpression = (data: Record<string, unknown>) => {
  const ExpressionAttributeNames: Record<string, string> = {};
  const ExpressionAttributeValues: Record<string, unknown> = {};
  const actions: string[] = [];

  Object.entries(data).forEach(([attr, val]) => {
    actions.push(`#${attr} = :${attr}`);
    ExpressionAttributeNames[`#${attr}`] = attr;
    ExpressionAttributeValues[`:${attr}`] = val;
  });

  return {
    UpdateExpression: `set ${actions.join(',')}`,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };
};
