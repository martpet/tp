import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

import { region, sessionsTableOptions } from '~/consts';
import { SessionsTableItem } from '~/types';
import { createDynamoUpdateExpression } from '~/utils';

const ddbClient = new DynamoDBClient({ region });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

type UpdateSessionProps = {
  sessionId: string;
  idToken: string;
};

export const updateSession = ({ sessionId, idToken }: UpdateSessionProps) => {
  const { tableName, partitionKey } = sessionsTableOptions;

  const data: Partial<SessionsTableItem> = {
    idToken,
  };

  const updateCommand = new UpdateCommand({
    TableName: tableName,
    Key: { [partitionKey.name]: sessionId },
    ...createDynamoUpdateExpression(data),
  });

  return ddbDocClient.send(updateCommand);
};
