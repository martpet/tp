import {
  APIGatewayProxyHandlerV2,
  DynamoDBClient,
  DynamoDBDocumentClient,
  errorResponse,
  GetCommand,
  GetPhotosResponse,
  PathParam,
  photosTableOptions,
  StatusCodes,
} from 'lambda-layer';

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

export const handler: APIGatewayProxyHandlerV2<GetPhotosResponse> = async (event) => {
  const { fingerprint } = event.pathParameters as PathParam<'/photos', 'GET'>;

  if (!fingerprint) {
    return errorResponse('564208f603', { statusCode: StatusCodes.BAD_REQUEST });
  }

  const getCommand = new GetCommand({
    TableName: photosTableOptions.tableName,
    Key: { [photosTableOptions.partitionKey.name]: fingerprint },
  });

  const { Item } = await ddbDocClient.send(getCommand);

  if (!Item) {
    return errorResponse('565cca53ca', { statusCode: StatusCodes.NOT_FOUND });
  }

  return Item;
};
