import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import millis from 'milliseconds';

import { IdTokenPayload } from '~/constructs/Api/types';
import {
  getIdTokenPayload,
  itRejectsCorrectly,
  itResolvesCorrectly,
  itSendsDdbCommand,
} from '~/constructs/Api/utils';

import { fetchNewIdToken } from '../fetchNewIdToken';
import { getIdToken } from '../getIdToken';

vi.mock('../fetchNewIdToken');
vi.mock('~/constructs/Api/utils/getIdTokenPayload');

const ddbMock = mockClient(DynamoDBDocumentClient);
const originalDate = Date.now();
const idTokenExpiresInMills = Date.now() + millis.days(1);
const refreshTokenExpires = Date.now() + millis.years(1);

const args = ['dummySessionId'] as Parameters<typeof getIdToken>;

vi.mocked(fetchNewIdToken).mockResolvedValue('newDummyIdToken');

vi.mocked(getIdTokenPayload).mockResolvedValue({
  exp: idTokenExpiresInMills / 1000,
  aud: 'dummyAud',
} as IdTokenPayload);

beforeEach(() => {
  ddbMock.reset();

  ddbMock.on(GetCommand).resolves({
    Item: {
      idToken: 'dummyIdToken',
      refreshToken: 'dummyRefreshToken',
      refreshTokenExpires,
    },
  });
});

describe('getTokens', () => {
  itSendsDdbCommand(GetCommand, ddbMock, getIdToken, args);
  itResolvesCorrectly(getIdToken, args);

  describe('when "Item" prop is missing from "GetCommand" output', () => {
    beforeEach(() => {
      ddbMock.on(GetCommand).resolves({});
    });
    itRejectsCorrectly(getIdToken, args);
  });

  describe('when "idToken" has expired', () => {
    beforeAll(() => {
      vi.setSystemTime(new Date(idTokenExpiresInMills + millis.days(1)));
    });

    afterAll(() => {
      vi.setSystemTime(originalDate);
    });

    it('calls "fetchNewIdToken" with correct args', async () => {
      await getIdToken(...args);
      expect(vi.mocked(fetchNewIdToken).mock.calls).toMatchSnapshot();
    });

    itResolvesCorrectly(getIdToken, args);
  });

  describe('when "refreshToken" has expired', () => {
    beforeAll(() => {
      vi.setSystemTime(new Date(refreshTokenExpires + millis.days(1)));
    });

    afterAll(() => {
      vi.setSystemTime(originalDate);
    });
    itRejectsCorrectly(getIdToken, args);
  });
});
