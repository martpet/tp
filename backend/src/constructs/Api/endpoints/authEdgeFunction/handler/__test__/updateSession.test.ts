import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

import { itResolves, itSendsAwsCommand } from '~/constructs/Api/utils';

import { updateSession } from '../updateSession';

const ddbMock = mockClient(DynamoDBDocumentClient);

const args = [
  {
    sessionId: 'dummySessoinid',
    idToken: 'dummyIdToken',
  },
] as Parameters<typeof updateSession>;

beforeEach(() => {
  ddbMock.reset();

  ddbMock.on(UpdateCommand).resolves({
    Attributes: {
      dummyUpdateCommandAttr: 'dummyUpdateCommandAttrValue',
    },
  });
});

describe('updateSession', () => {
  itSendsAwsCommand(UpdateCommand, ddbMock, updateSession, args);
  itResolves(updateSession, args);
});
