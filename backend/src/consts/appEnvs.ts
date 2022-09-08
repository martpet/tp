import {
  appleClientIdDev,
  appleClientIdProd,
  appleClientIdStaging,
  appleKeyIdDev,
  appleKeyIdProd,
  appleKeyIdStaging,
  devAccountServiceRoleArn,
  devHostedZoneId,
  googleClientIdDev,
  googleClientIdProd,
  googleClientIdStaging,
  healthCheckAlarmEmails,
  prodAccountId,
  region,
  rootDomain,
  rootHostedZoneId,
  stagingAccountId,
  stagingHostedZoneId,
} from '~/consts';
import { AppEnv, EnvName } from '~/types';
import { getPersonalDevDomain } from '~/utils';

export const appEnvs: Record<EnvName, AppEnv> = {
  production: {
    appDomain: rootDomain,
    hostedZoneId: rootHostedZoneId,
    healthCheckAlarmEmails,
    googleClientId: googleClientIdProd,
    appleClientId: appleClientIdProd,
    appleKeyId: appleKeyIdProd,
    env: {
      account: prodAccountId,
      region,
    },
  },
  staging: {
    appDomain: `test.${rootDomain}`,
    hostedZoneId: stagingHostedZoneId,
    healthCheckAlarmEmails,
    googleClientId: googleClientIdStaging,
    appleClientId: appleClientIdStaging,
    appleKeyId: appleKeyIdStaging,
    env: {
      account: stagingAccountId,
      region,
    },
  },
  personal: {
    appDomain: getPersonalDevDomain(process.env),
    parentHostedZoneId: devHostedZoneId,
    parentHostedZoneRoleArn: devAccountServiceRoleArn,
    googleClientId: googleClientIdDev,
    appleClientId: appleClientIdDev,
    appleKeyId: appleKeyIdDev,
    oauthSecretsRoleArn: devAccountServiceRoleArn,
  },
};
