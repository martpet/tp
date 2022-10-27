import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';

import {
  itGetsIdTokenPayload,
  itResolves,
  itResolvesWithError,
  itSendsDdbCommand,
} from '~/constructs/Api/utils';
import { PatchSettingsResponse } from '~/types';

import { handler } from '../patch-settings';

vi.mock('~/constructs/Api/utils/errorResponse');
vi.mock('~/constructs/Api/utils/getIdTokenPayload');

const ddbMock = mockClient(DynamoDBDocumentClient);

const args = [
  {
    headers: { authorization: 'dummyAuthorizationHeader' },
    body: JSON.stringify({ language: 'dummyLanguage' }),
  },
] as unknown as Parameters<APIGatewayProxyHandlerV2<PatchSettingsResponse>>;

beforeEach(() => {
  ddbMock.reset();
  ddbMock.on(UpdateCommand).resolves({});
});

describe('patch-settings', () => {
  itGetsIdTokenPayload(handler, args);

  itSendsDdbCommand(UpdateCommand, ddbMock, handler, args);

  itResolves(handler, args);

  describe('when "event.body" is missing', () => {
    const argsClone = structuredClone(args);
    argsClone[0].body = undefined;
    itResolvesWithError(handler, argsClone);
  });

  describe('when "event.body" is not JSON', () => {
    const argsClone = structuredClone(args);
    argsClone[0].body = 'not json';
    itResolvesWithError(handler, argsClone);
  });

  describe('when "event.body" has unallowed keys', () => {
    const argsClone = structuredClone(args);
    argsClone[0].body = JSON.stringify({ dummyUnallowedKey: '' });
    itResolvesWithError(handler, argsClone);
  });
});
