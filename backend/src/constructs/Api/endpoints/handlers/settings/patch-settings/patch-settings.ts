import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';

import { EndpointHeaders } from '~/constructs/Api/types';
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

export const handler: APIGatewayProxyHandlerV2<PatchSettingsResponse> = async ({
  body,
  headers,
}) => {
  let data;
  const { authorization } = headers as EndpointHeaders<'/settings'>;

  if (!authorization) {
    return errorResponse('UMxOJy1cpJ');
  }

  if (!body) {
    return errorResponse('x1IsNHbqd3', { statusCode: StatusCodes.BAD_REQUEST });
  }

  try {
    data = JSON.parse(body);
  } catch (e) {
    return errorResponse('d6QTt6tKWK', { statusCode: StatusCodes.BAD_REQUEST });
  }

  const hasUnallowedKeys = Object.keys(data).some(
    (key) => !allowedSettingsKeys.includes(key as keyof UserSettings)
  );

  if (hasUnallowedKeys) {
    return errorResponse('IUKROTi0UF', { statusCode: StatusCodes.BAD_REQUEST });
  }

  const { sub } = getIdTokenPayload(authorization);
  const settingsAttrName: keyof UsersTableItem = 'settings';

  const updateCommand = new UpdateCommand({
    TableName: usersTableOptions.tableName,
    Key: { [usersTableOptions.partitionKey.name]: sub },
    ...createDynamoUpdateExpression(data, settingsAttrName),
  });

  await ddbDocClient.send(updateCommand);

  return {
    statusCode: StatusCodes.NO_CONTENT,
  };
};
