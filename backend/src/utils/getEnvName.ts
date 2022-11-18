import { Construct } from 'constructs';

import { EnvName } from '~/types';

export const getEnvName = (scope: Construct) => {
  const envName = scope.node.tryGetContext('envName') as EnvName;

  if (!envName) {
    throw Error('`envName` in CDK context is required');
  }

  return envName;
};
