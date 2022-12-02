import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

import { itRejectsCorrectly, itResolvesCorrectly, itSendsDdbCommand } from '~/constructs/Api/utils';

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
  itSendsDdbCommand(DeleteCommand, ddbMock, deleteSession, args);
  itResolvesCorrectly(deleteSession, args);

  describe('when "Attributes" prop is missing from "DeleteCommand" output', () => {
    beforeEach(() => {
      ddbMock.on(DeleteCommand).resolves({});
    });
    itRejectsCorrectly(deleteSession, args);
  });
});
