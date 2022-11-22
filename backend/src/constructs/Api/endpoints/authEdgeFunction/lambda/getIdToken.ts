import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

import { getIdTokenPayload } from '~/constructs/Api/utils';
import { region, sessionsTableOptions } from '~/consts';
import { SessionsTableItem } from '~/types';

import { fetchNewIdToken } from './fetchNewIdToken';

const ddbClient = new DynamoDBClient({ region });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

// [todo] Rename to `fetchIdToken`
export const getIdToken = async (sessionId: string) => {
  const getCommand = new GetCommand({
    TableName: sessionsTableOptions.tableName,
    Key: { [sessionsTableOptions.partitionKey.name]: sessionId },
  });

  const { Item } = await ddbDocClient.send(getCommand);
  const sessionsItem = Item as SessionsTableItem | undefined;

  if (!sessionsItem) {
    throw new Error(`could not find session with id "${sessionId}"`);
  }

  const { idToken, refreshToken, refreshTokenExpires } = sessionsItem;
  const { exp, aud: clientId } = getIdTokenPayload(idToken);

  const idTokenExpires = (exp - 5) * 1000; // 'exp' is in seconds since epoch

  if (idTokenExpires > Date.now()) {
    return idToken;
  }

  if (refreshTokenExpires > Date.now()) {
    return fetchNewIdToken({ refreshToken, sessionId, clientId });
  }

  /*
  [todo] Instead, throw a specific error, catch it in authEdgeHandler,
  return a specific response that is handled by a custom `baseQuery`,
  that triggers the loggin popup, and retries request on successfull login:

  https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-re-authorization-by-extending-fetchbasequery
  */
  throw new Error('`id` and `refresh` tokens have expired');
};
