import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

import { itRejects, itResolves, itSendsDdbCommand } from '~/constructs/Api/utils';
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
  it('calls "getUserPropsFromCognitoEvent" with correct args', async () => {
    await updateUserFromCognitoEvent(event);
    expect(vi.mocked(getUserPropsFromCognitoEvent).mock.calls).toMatchSnapshot();
  });

  itSendsDdbCommand(GetCommand, ddbMock, updateUserFromCognitoEvent, args);

  it('calls "filterChangedProps" with correct args', async () => {
    await updateUserFromCognitoEvent(...args);
    expect(vi.mocked(filterChangedProps).mock.calls).toMatchSnapshot();
  });

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
    it('calls "createDynamoUpdateExpression" with correct args', async () => {
      await updateUserFromCognitoEvent(...args);
      expect(vi.mocked(createDynamoUpdateExpression).mock.calls).toMatchSnapshot();
    });

    itSendsDdbCommand(UpdateCommand, ddbMock, updateUserFromCognitoEvent, args);
    itResolves(updateUserFromCognitoEvent, args);
  });
});
