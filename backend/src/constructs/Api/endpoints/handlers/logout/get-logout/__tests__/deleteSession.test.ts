import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

import { itRejects, itResolves, itSendsAwsCommand } from '~/constructs/Api/utils';

import { deleteSession } from '../deleteSession';

const ddbMock = mockClient(DynamoDBDocumentClient);

const args = ['dummySessionId'] as Parameters<typeof deleteSession>;

beforeEach(() => {
  ddbMock.reset();

  ddbMock
    .on(DeleteCommand)
    .resolves({ Attributes: { refreshToken: 'dummyRefreshToken' } });
});

describe('deleteSession', () => {
  itSendsAwsCommand(DeleteCommand, ddbMock, deleteSession, args);
  itResolves(deleteSession, args);

  describe('when "Attributes" prop is missing from "DeleteCommand" output', () => {
    beforeEach(() => {
      ddbMock.on(DeleteCommand).resolves({});
    });
    itRejects(deleteSession, args);
  });
});
