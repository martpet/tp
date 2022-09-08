import { AssumeRoleCommand, Credentials, STSClient } from '@aws-sdk/client-sts';
import { mockClient } from 'aws-sdk-client-mock';
import camelcaseKeys from 'camelcase-keys';

import { getRoleCredentials } from '~/utils';

const stsMock = mockClient(STSClient);

vi.mock('camelcase-keys');

const args = ['dummyRoleArn', 'dummySessionName'] as const;

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
  it('sends "AssumeRoleCommand" to STS with correct args', async () => {
    await getRoleCredentials(...args);
    expect(stsMock.commandCalls(AssumeRoleCommand)[0].args[0].input).toMatchSnapshot();
  });

  it('calls "camelcaseKeys" with correct args', async () => {
    await getRoleCredentials(...args);
    expect(vi.mocked(camelcaseKeys).mock.calls).toMatchSnapshot();
  });

  it('resolves with a correct value', () => {
    return expect(getRoleCredentials(...args)).resolves.toMatchSnapshot();
  });

  describe('when credentials are missing from "AssumeRoleCommand" output', () => {
    beforeEach(() => {
      stsMock.on(AssumeRoleCommand).resolves({});
    });

    it('rejects with a correct value', () => {
      return expect(getRoleCredentials(...args)).rejects.toMatchSnapshot();
    });
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
