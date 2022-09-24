import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { EventHeaders } from '~/constructs/Api/types';
import { errorResponse, getIdTokenPayload } from '~/constructs/Api/utils';

export const handler: APIGatewayProxyHandlerV2 = async ({ headers }) => {
  const { authorization: idToken } = headers as EventHeaders<'/me'>;

  if (!idToken) {
    return errorResponse('RyFuj-_6Qo');
  }

  const { givenName } = getIdTokenPayload(idToken);

  return givenName;
};
