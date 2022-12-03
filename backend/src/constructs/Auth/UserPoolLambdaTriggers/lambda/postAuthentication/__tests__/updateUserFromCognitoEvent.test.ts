import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

import {
  itCalls,
  itRejects,
  itResolves,
  itSendsAwsCommand,
} from '~/constructs/Api/utils';
import { createDynamoUpdateExpression, filterChangedProps } from '~/utils';

import { getUserPropsFromCognitoEvent } from '../../getUserPropsFromCognitoEvent';
import { updateUserFromCognitoEvent } from '../updateUserFromCognitoEvent';
import event from './__fixtures__/postAuthenticationEvent';

vi.mock('../../getUserPropsFromCognitoEvent');
vi.mock('~/../../shared/utils/filterChangedProps');
vi.mock('~/utils/createDynamoUpdateExpression');

const ddbMock = mockClient(DynamoDBDocumentClient);

const args = [event] as Parameters<typeof updateUserFromCognitoEvent>;

beforeEach(() => {
  ddbMock.reset();

  ddbMock.on(GetCommand).resolves({
    Item: {
      id: 'dummyId',
      dummyGetCommandOutputKey: 'dummyGetCommandOutputValue',
    },
  });

  ddbMock.on(UpdateCommand).resolves({
    Attributes: { dummyUpdateCommandAttrKey: 'dummyUpdateCommandAttrValue' },
  });
});

describe('updateUserFromCognitoEvent', () => {
  itCalls(getUserPropsFromCognitoEvent, updateUserFromCognitoEvent, args);
  itCalls(filterChangedProps, updateUserFromCognitoEvent, args);
  itSendsAwsCommand(GetCommand, ddbMock, updateUserFromCognitoEvent, args);

  describe('when output from "GetCommand" does not include "Item"', () => {
    beforeEach(() => {
      ddbMock.on(GetCommand).resolves({});
    });
    itRejects(updateUserFromCognitoEvent, args);
  });

  describe('when user props in event are not changed', () => {
    beforeEach(() => {
      vi.mocked(filterChangedProps).mockImplementationOnce(() => undefined);
    });
    itResolves(updateUserFromCognitoEvent, args);
  });

  describe('when user props in event are changed', () => {
    itCalls(createDynamoUpdateExpression, updateUserFromCognitoEvent, args);
    itSendsAwsCommand(UpdateCommand, ddbMock, updateUserFromCognitoEvent, args);
    itResolves(updateUserFromCognitoEvent, args);
  });
});
