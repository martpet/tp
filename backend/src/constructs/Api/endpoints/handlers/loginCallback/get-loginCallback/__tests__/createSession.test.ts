import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import cookie from 'cookie';

import { OauthTokens } from '~/constructs/Api/types';

import { createSession } from '../createSession';

const ddbMock = mockClient(DynamoDBDocumentClient);

vi.mock('cookie');
vi.mock('nanoid');

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
  it('calls "cookie.serialize" with correct args', async () => {
    await createSession(...args);
    expect(vi.mocked(cookie.serialize).mock.calls).toMatchSnapshot();
  });

  it('sends "PutCommand" to DynamoDB with correct args', async () => {
    await createSession(...args);
    expect(ddbMock.commandCalls(PutCommand)[0].args[0].input).toMatchSnapshot();
  });

  it('resolves with a correct value', () => {
    return expect(createSession(...args)).resolves.toMatchSnapshot();
  });

  describe('when "globalLambdaProps.cdkNev" is "personal"', () => {
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
