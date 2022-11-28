import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';

import { ApiRouteHeaders } from '~/constructs/Api/types';
import { errorResponse, getIdTokenPayload } from '~/constructs/Api/utils';
import { usersTableOptions } from '~/consts';
import {
  PatchSettingsRequestBody,
  PatchSettingsResponseBody,
  UserSettings,
  UsersTableItem,
} from '~/types';
import { createDynamoUpdateExpression } from '~/utils';

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const allowedSettingsKeys: Array<keyof UserSettings> = [
  'language',
  'colorScheme',
  'toolbarPosition',
];

const settingsAttrName: keyof UsersTableItem = 'settings';

export const handler: APIGatewayProxyHandlerV2<PatchSettingsResponseBody> = async (
  event
) => {
  const { authorization } = event.headers as ApiRouteHeaders<'/settings'>;
  let patch;

  if (!authorization) {
    return errorResponse('UMxOJy1cpJ');
  }

  if (!event.body) {
    return errorResponse('x1IsNHbqd3', { statusCode: StatusCodes.BAD_REQUEST });
  }

  try {
    patch = JSON.parse(event.body) as PatchSettingsRequestBody;
  } catch (error) {
    return errorResponse('d6QTt6tKWK', { statusCode: StatusCodes.BAD_REQUEST, error });
  }

  const hasUnknownKeys = Object.keys(patch).some(
    (key) => !allowedSettingsKeys.includes(key as keyof UserSettings)
  );

  if (hasUnknownKeys) {
    return errorResponse('IUKROTi0UF', { statusCode: StatusCodes.BAD_REQUEST });
  }

  const { sub } = getIdTokenPayload(authorization);

  const updateCommand = new UpdateCommand({
    TableName: usersTableOptions.tableName,
    Key: { [usersTableOptions.partitionKey.name]: sub },
    ...createDynamoUpdateExpression(patch, settingsAttrName),
  });

  await ddbDocClient.send(updateCommand);

  return {
    statusCode: StatusCodes.NO_CONTENT,
  };
};
