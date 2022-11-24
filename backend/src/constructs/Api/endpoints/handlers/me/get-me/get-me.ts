import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { ApiRouteHeaders } from '~/constructs/Api/types';
import { errorResponse, getIdTokenPayload } from '~/constructs/Api/utils';
import { usersTableOptions } from '~/consts';
import { GetMeResponse } from '~/types';

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

export const handler: APIGatewayProxyHandlerV2<GetMeResponse> = async ({ headers }) => {
  const { authorization } = headers as ApiRouteHeaders<'/me'>;

  if (!authorization) {
    return errorResponse('RyFuj-_6Qo');
  }

  const { sub } = getIdTokenPayload(authorization);

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
