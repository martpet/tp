import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';
import { Credentials } from '@aws-sdk/types';

export const getRoleCredentials = async (RoleArn: string, sessionName: string) => {
  const stsClient = new STSClient({});
  const camelcaseKeys = (await import('camelcase-keys')).default;

  const assumeRoleCommand = new AssumeRoleCommand({
    RoleArn,
    RoleSessionName: `${sessionName}-${new Date().getTime()}`,
  });

  const { Credentials: credentials } = await stsClient.send(assumeRoleCommand);

  if (!credentials) {
    throw Error('Cannot get credentials');
  }

  if (!credentials.AccessKeyId || !credentials.SecretAccessKey) {
    throw Error('Missing credentials prop');
  }

  return camelcaseKeys(credentials) as Credentials;
};
