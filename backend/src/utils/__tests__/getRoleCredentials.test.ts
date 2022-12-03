import { AssumeRoleCommand, Credentials, STSClient } from '@aws-sdk/client-sts';
import { mockClient } from 'aws-sdk-client-mock';
import camelcaseKeys from 'camelcase-keys';

import {
  itCalls,
  itRejects,
  itResolves,
  itSendsAwsCommand,
} from '~/constructs/Api/utils';
import { getRoleCredentials } from '~/utils';

const stsMock = mockClient(STSClient);

vi.mock('camelcase-keys');

const args = ['dummyRoleArn', 'dummySessionName'] as Parameters<
  typeof getRoleCredentials
>;

const assumeRoleOutput = {
  Credentials: {
    AccessKeyId: 'dummyAccessKeyId',
    SecretAccessKey: 'dummySecretAccessKey',
    SessionToken: 'dummySessionToken',
    Expiration: new Date(),
  },
};

beforeEach(() => {
  stsMock.reset();
  stsMock.on(AssumeRoleCommand).resolves(assumeRoleOutput);
});

describe('getRoleCredentials', () => {
  itCalls(camelcaseKeys, getRoleCredentials, args);
  itSendsAwsCommand(AssumeRoleCommand, stsMock, getRoleCredentials, args);
  itResolves(getRoleCredentials, args);

  describe('when credentials are missing from "AssumeRoleCommand" output', () => {
    beforeEach(() => {
      stsMock.on(AssumeRoleCommand).resolves({});
    });
    itRejects(getRoleCredentials, args);
  });

  describe.each(['AccessKeyId', 'SecretAccessKey'])(
    'when "%s" credentials prop is missing from "AssumeRoleCommand" output',
    (key) => {
      const assumeRoleOutputClone = structuredClone(assumeRoleOutput);
      delete assumeRoleOutputClone.Credentials[key as keyof Credentials];

      it('rejects with a correct value', async () => {
        await stsMock.on(AssumeRoleCommand).resolves(assumeRoleOutputClone);
        return expect(getRoleCredentials(...args)).rejects.toMatchSnapshot();
      });
    }
  );
});
