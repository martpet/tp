import { App } from 'aws-cdk-lib';

import { RootStack } from '~/constructs';
import { appEnvs, appName } from '~/consts';
import { checkLocalEnvVars, getEnvName } from '~/utils';

const app = new App();
const envName = getEnvName(app);
const { env } = appEnvs[envName];

checkLocalEnvVars(envName);
new RootStack(app, appName, { env });
