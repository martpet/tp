import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

import { deleteSession } from '../deleteSession';

const ddbMock = mockClient(DynamoDBDocumentClient);

const args = ['dummySessionId'] as const;

beforeEach(() => {
  ddbMock.reset();

  ddbMock
    .on(DeleteCommand)
    .resolves({ Attributes: { refreshToken: 'dummyRefreshToken' } });
});

describe('deleteSession', () => {
  it('sends "DeleteCommand" to DynamoDB with correct args', async () => {
    await deleteSession(...args);
    expect(ddbMock.commandCalls(DeleteCommand)[0].args[0].input).toMatchSnapshot();
  });

  it('resolves with a correct value', () => {
    return expect(deleteSession(...args)).resolves.toMatchSnapshot();
  });

  describe('when "Attributes" prop is missing from "DeleteCommand" output', () => {
    beforeEach(() => {
      ddbMock.on(DeleteCommand).resolves({});
    });

    it('rejects with a correct value', () => {
      return expect(deleteSession(...args)).rejects.toMatchSnapshot();
    });
  });
});
