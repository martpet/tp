import {
  APIGatewayProxyHandlerV2,
  createDynamoUpdateExpression,
  DynamoDBClient,
  DynamoDBDocumentClient,
  errorResponse,
  getIdTokenPayload,
  PatchSettingsRequest,
  PatchSettingsResponse,
  RouteHeaders,
  StatusCodes,
  UpdateCommand,
  UserSettings,
  UsersTableItem,
  usersTableOptions,
} from 'lambda-layer';

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const allowedSettingsKeys: Array<keyof UserSettings> = [
  'language',
  'colorScheme',
  'toolbarPosition',
];

const settingsAttrName: keyof UsersTableItem = 'settings';

export const handler: APIGatewayProxyHandlerV2<PatchSettingsResponse> = async (event) => {
  const { authorization } = event.headers as RouteHeaders<'/settings'>;
  let patch;

  if (!authorization) {
    return errorResponse('UMxOJy1cpJ');
  }

  if (!event.body) {
    return errorResponse('x1IsNHbqd3', { statusCode: StatusCodes.BAD_REQUEST });
  }

  try {
    patch = JSON.parse(event.body) as PatchSettingsRequest;
  } catch (error) {
    return errorResponse('d6QTt6tKWK', { statusCode: StatusCodes.BAD_REQUEST, error });
  }

  const hasUnknownKeys = Object.keys(patch).some(
    (key) => !allowedSettingsKeys.includes(key as keyof UserSettings)
  );

  if (hasUnknownKeys) {
    return errorResponse('IUKROTi0UF', { statusCode: StatusCodes.BAD_REQUEST });
  }

  const { sub } = await getIdTokenPayload(authorization);

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
