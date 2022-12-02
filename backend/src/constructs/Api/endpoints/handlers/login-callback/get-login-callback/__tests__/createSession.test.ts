import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import cookie from 'cookie';

import { OauthTokens } from '~/constructs/Api/types';
import { itResolvesCorrectly, itSendsDdbCommand } from '~/constructs/Api/utils';

import { createSession } from '../createSession';

const ddbMock = mockClient(DynamoDBDocumentClient);

vi.mock('cookie');
vi.mock('crypto');

const args = [
  {
    tokens: {
      accessToken: 'dummyAccessToken',
      refreshToken: 'dummyRefreshToken',
      idToken: 'dummyIdToken',
      idTokenPayload: { sub: 'dummySub ' },
    } as OauthTokens,
  },
] as Parameters<typeof createSession>;

beforeEach(() => {
  ddbMock.reset();
});

describe('createSession', () => {
  itSendsDdbCommand(PutCommand, ddbMock, createSession, args);
  itResolvesCorrectly(createSession, args);

  it('calls "cookie.serialize" with correct args', async () => {
    await createSession(...args);
    expect(vi.mocked(cookie.serialize).mock.calls).toMatchSnapshot();
  });

  describe('when "globalLambdaProps.envName" is "personal"', () => {
    const initialEnvName = globalLambdaProps.envName;

    beforeAll(() => {
      globalLambdaProps.envName = 'personal';
    });

    afterAll(() => {
      globalLambdaProps.envName = initialEnvName;
    });

    it('calls "cookie.serialize" with correct args', async () => {
      await createSession(...args);
      expect(vi.mocked(cookie.serialize).mock.calls).toMatchSnapshot();
    });
  });
});
