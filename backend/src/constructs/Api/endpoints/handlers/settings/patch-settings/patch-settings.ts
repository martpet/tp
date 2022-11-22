import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';

import { ApiRouteHeaders } from '~/constructs/Api/types';
import { errorResponse, getIdTokenPayload } from '~/constructs/Api/utils';
import { usersTableOptions } from '~/consts';
import { PatchSettingsResponse, UserSettings, UsersTableItem } from '~/types';
import { createDynamoUpdateExpression } from '~/utils';

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const allowedSettingsKeys: Array<keyof UserSettings> = [
  'language',
  'colorScheme',
  'toolbarPosition',
];

const settingsAttrName: keyof UsersTableItem = 'settings';

export const handler: APIGatewayProxyHandlerV2<PatchSettingsResponse> = async (event) => {
  const { authorization } = event.headers as ApiRouteHeaders<'/settings'>;
  let settingsPatch;

  if (!authorization) {
    return errorResponse('UMxOJy1cpJ');
  }

  if (!event.body) {
    return errorResponse('x1IsNHbqd3', { statusCode: StatusCodes.BAD_REQUEST });
  }

  try {
    settingsPatch = JSON.parse(event.body);
  } catch (_err) {
    return errorResponse('d6QTt6tKWK', { statusCode: StatusCodes.BAD_REQUEST });
  }

  const hasUnknownKeys = Object.keys(settingsPatch).some(
    (key) => !allowedSettingsKeys.includes(key as keyof UserSettings)
  );

  if (hasUnknownKeys) {
    return errorResponse('IUKROTi0UF', { statusCode: StatusCodes.BAD_REQUEST });
  }

  const { sub } = getIdTokenPayload(authorization);

  const updateCommand = new UpdateCommand({
    TableName: usersTableOptions.tableName,
    Key: { [usersTableOptions.partitionKey.name]: sub },
    ...createDynamoUpdateExpression(settingsPatch, settingsAttrName),
  });

  await ddbDocClient.send(updateCommand);

  return {
    statusCode: StatusCodes.NO_CONTENT,
  };
};
