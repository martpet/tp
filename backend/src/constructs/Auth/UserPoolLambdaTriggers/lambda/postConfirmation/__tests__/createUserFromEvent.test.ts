import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

import { createUserFromEvent } from '../createUserFromEvent';
import event from './__fixtures__/postConfirmationEvent';

vi.mock('../../getUserPropsFromCognitoEvent');

const ddbMock = mockClient(DynamoDBDocumentClient);

const args = [event] as const;

beforeEach(() => {
  ddbMock.reset();

  ddbMock
    .on(PutCommand)
    .resolves({ Attributes: { dummyPutCommandAttrKey: 'dummyPutCommandAttrValue' } });
});

describe('createUserFromEvent', () => {
  it('sends "PutCommand" to DynamoDB with correct args', async () => {
    await createUserFromEvent(...args);
    expect(ddbMock.commandCalls(PutCommand)[0].args[0].input).toMatchSnapshot();
  });

  it('resolves with a correct value', () => {
    return expect(createUserFromEvent(...args)).resolves.toMatchSnapshot();
  });
});
