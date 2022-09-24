import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

import { getIdTokenPayload } from '~/constructs/Api/utils';
import { region, sessionsTableOptions } from '~/consts';
import { SessionsTableItem } from '~/types';

import { fetchNewIdToken } from './fetchNewIdToken';

const ddbClient = new DynamoDBClient({ region });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

export const getIdToken = async (sessionId: string) => {
  const getCommand = new GetCommand({
    TableName: sessionsTableOptions.tableName,
    Key: { [sessionsTableOptions.partitionKey.name]: sessionId },
  });

  const { Item } = await ddbDocClient.send(getCommand);
  const sessionsItem = Item as SessionsTableItem | undefined;

  if (!sessionsItem) {
    throw new Error(`Could not find session with id "${sessionId}"`);
  }

  const { idToken, refreshToken, refreshTokenExpires } = sessionsItem;
  const { exp, aud: clientId } = getIdTokenPayload(idToken);
  const idTokenExpires = exp - 5000;

  if (idTokenExpires > Date.now()) {
    return idToken;
  }

  if (refreshTokenExpires > Date.now()) {
    return fetchNewIdToken({ refreshToken, sessionId, clientId });
  }

  throw new Error('ID token and refresh token have expired');
};
