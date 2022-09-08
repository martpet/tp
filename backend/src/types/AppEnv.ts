import { Environment } from 'aws-cdk-lib';

type Common = {
  appDomain: string;
  healthCheckAlarmEmails?: string[];
  googleClientId: string;
  appleClientId: string;
  appleKeyId: string;
  oauthSecretsRoleArn?: string;
};

type WithZoneDelegation = {
  hostedZoneId?: never;
  parentHostedZoneId: string;
  parentHostedZoneRoleArn: string;
};

type WithoutZoneDelegation = {
  hostedZoneId: string;
  parentHostedZoneId?: never;
  parentHostedZoneRoleArn?: never;
};

export type AppEnv = Common &
  (WithZoneDelegation | WithoutZoneDelegation) & { env?: Environment };
