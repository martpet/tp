import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { sessionsTableOptions } from '~/consts';
import { SessionsTableItem } from '~/types';

const ddbClient = new DynamoDBClient({});
const ddbDocumentClient = DynamoDBDocumentClient.from(ddbClient);

export const deleteSession = async (sessionId: string) => {
  const deleteCommand = new DeleteCommand({
    TableName: sessionsTableOptions.tableName,
    Key: { [sessionsTableOptions.partitionKey.name]: sessionId },
    ReturnValues: 'ALL_OLD',
  });

  const { Attributes } = await ddbDocumentClient.send(deleteCommand);
  const item = Attributes as SessionsTableItem | undefined;

  return item!.refreshToken;
};
