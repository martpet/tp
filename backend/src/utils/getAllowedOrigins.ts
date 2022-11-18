import { Construct } from 'constructs';

import { appEnvs, localhostUrl } from '~/consts';

import { getEnvName } from './getEnvName';

export const getAllowedOrigins = (scope: Construct) => {
  const envName = getEnvName(scope);
  const { appDomain } = appEnvs[envName];

  const origins = [`https://${appDomain}`];

  if (envName === 'personal') {
    origins.push(localhostUrl);
  }

  return origins;
};
