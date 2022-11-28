import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

import { itResolves, itSendsDdbCommand } from '~/constructs/Api/utils';

import { createUserFromCognitoEvent } from '../createUserFromCognitoEvent';
import event from './__fixtures__/postConfirmationEvent';

vi.mock('../../getUserPropsFromCognitoEvent');

const ddbMock = mockClient(DynamoDBDocumentClient);

const args = [event] as Parameters<typeof createUserFromCognitoEvent>;

beforeEach(() => {
  ddbMock.reset();

  ddbMock
    .on(PutCommand)
    .resolves({ Attributes: { dummyPutCommandAttrKey: 'dummyPutCommandAttrValue' } });
});

describe('createUserFromCognitoEvent', () => {
  itSendsDdbCommand(PutCommand, ddbMock, createUserFromCognitoEvent, args);
  itResolves(createUserFromCognitoEvent, args);
});
