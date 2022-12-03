import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import cookie from 'cookie';

import { OauthTokens } from '~/constructs/Api/types';
import { itCalls, itResolves, itSendsAwsCommand } from '~/constructs/Api/utils';

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
  itSendsAwsCommand(PutCommand, ddbMock, createSession, args);
  itCalls(cookie.serialize, createSession, args);
  itResolves(createSession, args);

  describe('when "globalLambdaProps.envName" is "personal"', () => {
    const initialEnvName = globalLambdaProps.envName;
    beforeAll(() => {
      globalLambdaProps.envName = 'personal';
    });
    afterAll(() => {
      globalLambdaProps.envName = initialEnvName;
    });
    itCalls(cookie.serialize, createSession, args);
  });
});
