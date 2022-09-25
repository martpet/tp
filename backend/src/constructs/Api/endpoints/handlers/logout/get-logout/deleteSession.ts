import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { sessionsTableOptions } from '~/consts';
import { SessionsTableItem } from '~/types';

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

export const deleteSession = async (sessionId: string) => {
  const deleteCommand = new DeleteCommand({
    TableName: sessionsTableOptions.tableName,
    Key: { [sessionsTableOptions.partitionKey.name]: sessionId },
    ReturnValues: 'ALL_OLD',
  });

  const { Attributes } = await ddbDocClient.send(deleteCommand);
  const sessionsItem = Attributes as SessionsTableItem | undefined;

  if (!sessionsItem) {
    throw new Error(`could not find session with id "${sessionId}"`);
  }

  return sessionsItem.refreshToken;
};
