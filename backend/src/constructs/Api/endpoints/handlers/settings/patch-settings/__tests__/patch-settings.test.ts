import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';

import {
  itGetsIdToken,
  itHasJsonBody,
  itResolves,
  itResolvesWithError,
  itSendsDdbCommand,
} from '~/constructs/Api/utils';

import { handler } from '../patch-settings';

vi.mock('~/constructs/Api/utils/errorResponse');
vi.mock('~/constructs/Api/utils/getIdTokenPayload');

const ddbMock = mockClient(DynamoDBDocumentClient);

const args = [
  {
    headers: { authorization: 'dummyAuthorizationHeader' },
    body: JSON.stringify({ language: 'dummyLanguage' }),
  },
] as unknown as Parameters<APIGatewayProxyHandlerV2>;

beforeEach(() => {
  ddbMock.reset();
  ddbMock.on(UpdateCommand).resolves({});
});

describe('patch-settings', () => {
  itHasJsonBody(handler, args);
  itGetsIdToken(handler, args);
  itSendsDdbCommand(UpdateCommand, ddbMock, handler, args);
  itResolves(handler, args);

  describe('when "event.body" has unallowed keys', () => {
    const argsClone = structuredClone(args);
    argsClone[0].body = JSON.stringify({ dummyUnallowedKey: '' });
    itResolvesWithError(handler, argsClone);
  });
});
