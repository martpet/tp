export const createDynamoUpdateExpression = (
  data: Record<string, unknown>,
  parentKey?: string
) => {
  const ExpressionAttributeNames: Record<string, string> = {};
  const ExpressionAttributeValues: Record<string, unknown> = {};
  const actions: string[] = [];

  Object.entries(data).forEach(([attr, val]) => {
    actions.push(`${parentKey ? `#${parentKey}.` : ''}#${attr} = :${attr}`);
    ExpressionAttributeNames[`#${attr}`] = attr;
    ExpressionAttributeValues[`:${attr}`] = val;
    if (parentKey) {
      ExpressionAttributeNames[`#${parentKey}`] = parentKey;
    }
  });

  return {
    UpdateExpression: `set ${actions.join(',')}`,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };
};
