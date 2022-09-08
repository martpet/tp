import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import cookie from 'cookie';
import { nanoid } from 'nanoid';

import { cookieName } from '~/constructs/Api/apiUtils';
import { refreshTokenValidityInDays, sessionsTableOptions } from '~/consts';
import { EnvName, SessionsTableItem } from '~/types';
import { daysToMilliseconds } from '~/utils';

import { OauthTokens } from '../../../apiTypes';

const ddbClient = new DynamoDBClient({});
const ddbDocumentClient = DynamoDBDocumentClient.from(ddbClient);

type CreateSessionProps = {
  tokens: OauthTokens;
  envName: string;
};

export const createSession = async ({ tokens, envName }: CreateSessionProps) => {
  const { idTokenPayload, accessToken, refreshToken } = tokens;

  const sessionId = nanoid();
  const created = Date.now();
  const expires = created + daysToMilliseconds(refreshTokenValidityInDays);

  const putCommandItem: SessionsTableItem = {
    id: sessionId,
    userId: idTokenPayload.sub,
    accessToken,
    refreshToken,
    created,
    expires,
  };

  const putCommand = new PutCommand({
    TableName: sessionsTableOptions.tableName,
    Item: putCommandItem,
  });

  await ddbDocumentClient.send(putCommand);

  const sessionCookie = cookie.serialize(cookieName('session'), sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: (envName as EnvName) === 'personal' ? 'none' : true,
    expires: new Date(expires),
  });

  return sessionCookie;
};
