import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';

import {
  itGetsIdTokenPayload,
  itResolves,
  itResolvesWithError,
  itSendsDdbCommand,
} from '~/constructs/Api/utils';
import { GetMeResponse } from '~/types';

import { handler } from '../get-me';

vi.mock('~/constructs/Api/utils/errorResponse');
vi.mock('~/constructs/Api/utils/getIdTokenPayload');

const ddbMock = mockClient(DynamoDBDocumentClient);

const args = [
  {
    headers: { authorization: 'dummyAuthorizationHeader' },
  },
] as unknown as Parameters<APIGatewayProxyHandlerV2<GetMeResponse>>;

beforeEach(() => {
  ddbMock.reset();

  ddbMock.on(GetCommand).resolves({
    Item: {
      givenName: 'dummyGivenName',
      familyName: 'dummyFamilyName',
      picture: 'dummyPicture',
      email: 'dummyEmail',
      settings: 'dummySettings',
      randomProp: 'this should not be included in response',
    },
  });
});

describe('get-me', () => {
  itGetsIdTokenPayload(handler, args);

  itSendsDdbCommand(GetCommand, ddbMock, handler, args);

  itResolves(handler, args);

  describe('when "Item" is missing from "GetCommand" output', () => {
    beforeEach(() => {
      ddbMock.on(GetCommand).resolves({});
    });
    itResolvesWithError(handler, args);
  });
});
