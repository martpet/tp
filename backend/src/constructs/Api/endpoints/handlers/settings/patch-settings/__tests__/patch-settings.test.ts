import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

import {
  itGetsIdToken,
  itHasJsonBody,
  itResolves,
  itResolvesWithError,
  itSendsAwsCommand,
} from '~/constructs/Api/utils';

import { handler } from '../patch-settings';

vi.mock('~/constructs/Api/utils/getIdTokenPayload');
vi.mock('~/constructs/Api/utils/errorResponse');

const ddbMock = mockClient(DynamoDBDocumentClient);

const args = [
  {
    headers: { authorization: 'dummyAuthorizationHeader' },
    body: JSON.stringify({ language: 'dummyLanguage' }),
  },
] as unknown as Parameters<typeof handler>;

beforeEach(() => {
  ddbMock.reset();
  ddbMock.on(UpdateCommand).resolves({});
});

describe('patch-settings', () => {
  itHasJsonBody(handler, args);
  itGetsIdToken(handler, args);
  itSendsAwsCommand(UpdateCommand, ddbMock, handler, args);
  itResolves(handler, args);

  describe('when "event.body" has unknown keys', () => {
    const argsClone = structuredClone(args);
    argsClone[0].body = JSON.stringify({ dummyUnknownKey: '' });
    itResolvesWithError(handler, argsClone);
  });
});
