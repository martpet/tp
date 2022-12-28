import {
  CognitoIdentityClient,
  GetCredentialsForIdentityCommand,
  GetIdCommand,
} from '@aws-sdk/client-cognito-identity';
import { mockClient } from 'aws-sdk-client-mock';

import {
  itHasEnvVars,
  itResolves,
  itResolvesWithError,
  itSendsAwsCommand,
} from '~/constructs/Api/utils';

import { handler } from '../get-public-credentials';

vi.mock('~/constructs/Api/utils/errorResponse');

process.env.identityPoolId = 'dummyIdentityPoolId';

const cognitoClientMock = mockClient(CognitoIdentityClient);

const args = [] as unknown as Parameters<typeof handler>;

beforeEach(() => {
  cognitoClientMock.reset();

  cognitoClientMock.on(GetIdCommand).resolves({
    IdentityId: 'dummyIdentityId',
  });
  cognitoClientMock.on(GetCredentialsForIdentityCommand).resolves({
    Credentials: {
      AccessKeyId: 'dummyAccessKeyId',
      SecretKey: 'dummySecretKey',
      SessionToken: 'dummySessionToken',
    },
  });
});

describe('get-public-credentials', () => {
  itHasEnvVars(['identityPoolId'], handler, args);
  itSendsAwsCommand(GetIdCommand, cognitoClientMock, handler, args);
  itSendsAwsCommand(GetCredentialsForIdentityCommand, cognitoClientMock, handler, args);
  itResolves(handler, args);

  describe('when "IdentityPoolId" is missing from GetIdCommand response', () => {
    beforeEach(() => {
      cognitoClientMock.on(GetIdCommand).resolves({});
    });
    itResolvesWithError(handler, args);
  });

  describe('when "Credentials" is missing from GetCredentialsForIdentityCommand response', () => {
    beforeEach(() => {
      cognitoClientMock.on(GetCredentialsForIdentityCommand).resolves({});
    });
    itResolvesWithError(handler, args);
  });
});
