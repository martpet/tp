import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

import { createDynamoUpdateExpression, filterChangedProps } from '~/utils';

import { getUserPropsFromCognitoEvent } from '../../getUserPropsFromCognitoEvent';
import { updateUserFromEvent } from '../updateUserFromEvent';
import event from './__fixtures__/postAuthenticationEvent';

vi.mock('../../getUserPropsFromCognitoEvent');
vi.mock('~/../../shared/utils/filterChangedProps');
vi.mock('~/utils/createDynamoUpdateExpression');

const ddbMock = mockClient(DynamoDBDocumentClient);

const args = [event] as const;

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

describe('updateUserFromEvent', () => {
  it('calls "getUserPropsFromCognitoEvent" with correct args', async () => {
    await updateUserFromEvent(event);
    expect(vi.mocked(getUserPropsFromCognitoEvent).mock.calls).toMatchSnapshot();
  });

  it('sends "GetCommand" to DynamoDB with correct args', async () => {
    await updateUserFromEvent(...args);
    expect(ddbMock.commandCalls(GetCommand)[0].args[0].input).toMatchSnapshot();
  });

  it('calls "filterChangedProps" with correct args', async () => {
    await updateUserFromEvent(...args);
    expect(vi.mocked(filterChangedProps).mock.calls).toMatchSnapshot();
  });

  describe('when output from "GetCommand" does not include "Item"', () => {
    beforeEach(() => {
      ddbMock.on(GetCommand).resolves({});
    });
    it('rejects with a correct value', () => {
      return expect(updateUserFromEvent(...args)).rejects.toMatchSnapshot();
    });
  });

  describe('when user props in event are not changed', () => {
    beforeEach(() => {
      vi.mocked(filterChangedProps).mockImplementationOnce(() => undefined);
    });
    it('resolves with a correct value', async () => {
      return expect(updateUserFromEvent(...args)).resolves.toMatchSnapshot();
    });
  });

  describe('when user props in event are changed', () => {
    it('calls "createDynamoUpdateExpression" with correct args', async () => {
      await updateUserFromEvent(...args);
      expect(vi.mocked(createDynamoUpdateExpression).mock.calls).toMatchSnapshot();
    });

    it('sends "UpdateCommand" to DynamoDB with correct args', async () => {
      await updateUserFromEvent(...args);
      expect(ddbMock.commandCalls(UpdateCommand)[0].args[0].input).toMatchSnapshot();
    });

    it('resolves with a correct value', () => {
      return expect(updateUserFromEvent(...args)).resolves.toMatchSnapshot();
    });
  });
});
