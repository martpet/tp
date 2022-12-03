import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

import {
  itGetsIdToken,
  itResolves,
  itResolvesWithError,
  itSendsAwsCommand,
} from '~/constructs/Api/utils';

import { handler } from '../get-me';

vi.mock('~/constructs/Api/utils/getIdTokenPayload');
vi.mock('~/constructs/Api/utils/errorResponse');

const ddbMock = mockClient(DynamoDBDocumentClient);

const args = [
  { headers: { authorization: 'dummyAuthorizationHeader' } },
] as unknown as Parameters<typeof handler>;

beforeEach(() => {
  ddbMock.reset();

  ddbMock.on(GetCommand).resolves({
    Item: {
      givenName: 'dummyGivenName',
      familyName: 'dummyFamilyName',
      picture: 'dummyPicture',
      email: 'dummyEmail',
      settings: 'dummySettings',
      providerName: 'dummyProviderName',
      unknownProp: 'this should not be included in response',
    },
  });
});

describe('get-me', () => {
  itGetsIdToken(handler, args);
  itSendsAwsCommand(GetCommand, ddbMock, handler, args);
  itResolves(handler, args);

  describe('when "Item" is missing from "GetCommand" output', () => {
    beforeEach(() => {
      ddbMock.on(GetCommand).resolves({});
    });
    itResolvesWithError(handler, args);
  });
});
