import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import cookie from 'cookie';
import millis from 'milliseconds';
import { nanoid } from 'nanoid';

import { OauthTokens } from '~/constructs/Api/types';
import { cookieName } from '~/constructs/Api/utils';
import { refreshTokenValidityInDays, sessionsTableOptions } from '~/consts';
import { SessionsTableItem } from '~/types';

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

type CreateSessionProps = {
  tokens: OauthTokens;
};

export const createSession = async ({ tokens }: CreateSessionProps) => {
  const { idTokenPayload, refreshToken, idToken } = tokens;
  const { envName } = globalLambdaProps;

  const sessionId = nanoid();
  const created = Date.now();
  const refreshTokenExpires = created + millis.days(refreshTokenValidityInDays);

  const putCommandItem: SessionsTableItem = {
    id: sessionId,
    userId: idTokenPayload.sub,
    created,
    refreshToken,
    refreshTokenExpires,
    idToken,
  };

  const putCommand = new PutCommand({
    TableName: sessionsTableOptions.tableName,
    Item: putCommandItem,
  });

  await ddbDocClient.send(putCommand);

  const sessionCookie = cookie.serialize(cookieName('sessionId'), sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: envName !== 'personal' || 'none',
    expires: new Date(refreshTokenExpires),
  });

  return sessionCookie;
};
