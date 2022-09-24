import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

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
  it('sends "UpdateCommand" to DynamoDB with correct args', async () => {
    await updateSession(...args);
    expect(ddbMock.commandCalls(UpdateCommand)[0].args[0].input).toMatchSnapshot();
  });

  it('resolves with a correct value', () => {
    return expect(updateSession(...args)).resolves.toMatchSnapshot();
  });
});
