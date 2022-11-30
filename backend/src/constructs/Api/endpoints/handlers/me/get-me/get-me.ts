import {
  APIGatewayProxyHandlerV2,
  ApiRouteHeaders,
  DynamoDBClient,
  DynamoDBDocumentClient,
  errorResponse,
  GetCommand,
  getIdTokenPayload,
  GetMeResponse,
  usersTableOptions,
} from 'lambda-layer';

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

export const handler: APIGatewayProxyHandlerV2<GetMeResponse> = async ({ headers }) => {
  const { authorization } = headers as ApiRouteHeaders<'/me'>;

  if (!authorization) {
    return errorResponse('RyFuj-_6Qo');
  }

  const { sub } = await getIdTokenPayload(authorization);

  const getCommand = new GetCommand({
    TableName: usersTableOptions.tableName,
    Key: { [usersTableOptions.partitionKey.name]: sub },
  });

  const { Item: user } = await ddbDocClient.send(getCommand);

  if (!user) {
    return errorResponse('Satqo0r-AS');
  }

  return {
    givenName: user.givenName,
    familyName: user.familyName,
    picture: user.picture,
    email: user.email,
    settings: user.settings,
    providerName: user.providerName,
  };
};
