import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import millis from 'milliseconds';

import { IdTokenPayload } from '~/constructs/Api/types';
import { getIdTokenPayload } from '~/constructs/Api/utils';

import { fetchNewIdToken } from '../fetchNewIdToken';
import { getIdToken } from '../getIdToken';

vi.mock('../fetchNewIdToken');
vi.mock('~/constructs/Api/utils/getIdTokenPayload');

const ddbMock = mockClient(DynamoDBDocumentClient);
const originalDate = Date.now();
const idTokenExpires = Date.now() + millis.days(1);
const refreshTokenExpires = Date.now() + millis.years(1);
const args = ['dummySessionId'] as Parameters<typeof getIdToken>;

vi.mocked(fetchNewIdToken).mockResolvedValue('newDummyIdToken');

vi.mocked(getIdTokenPayload).mockReturnValue({
  exp: idTokenExpires,
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
  it('sends "GetCommand" to DynamoDB with correct args', async () => {
    await getIdToken(...args);
    expect(ddbMock.commandCalls(GetCommand)[0].args[0].input).toMatchSnapshot();
  });

  it('resolves with a correct value', () => {
    return expect(getIdToken(...args)).resolves.toMatchSnapshot();
  });

  describe('when "Item" prop is missing from "GetCommand" output', () => {
    beforeEach(() => {
      ddbMock.on(GetCommand).resolves({});
    });

    it('rejects with a correct value', () => {
      return expect(getIdToken(...args)).rejects.toMatchSnapshot();
    });
  });

  describe('when "idToken" has expired', () => {
    beforeAll(() => {
      vi.setSystemTime(new Date(idTokenExpires + millis.days(1)));
    });

    afterAll(() => {
      vi.setSystemTime(originalDate);
    });

    it('calls "fetchNewIdToken" with correct args', async () => {
      await getIdToken(...args);
      expect(vi.mocked(fetchNewIdToken).mock.calls).toMatchSnapshot();
    });

    it('resolves with a correct value', () => {
      return expect(getIdToken(...args)).resolves.toMatchSnapshot();
    });
  });

  describe('when "refreshToken" has expired', () => {
    beforeAll(() => {
      vi.setSystemTime(new Date(refreshTokenExpires + millis.days(1)));
    });

    afterAll(() => {
      vi.setSystemTime(originalDate);
    });

    it('rejects with a correct value', () => {
      return expect(getIdToken(...args)).rejects.toMatchSnapshot();
    });
  });
});
