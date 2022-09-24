import { App } from 'aws-cdk-lib';

import { appEnvs, appName } from '~/consts';
import { RootStack } from '~/stacks';
import { checkLocalEnvVars, getEnvName } from '~/utils';

const app = new App();
const envName = getEnvName(app);
const { env } = appEnvs[envName];

checkLocalEnvVars(envName);
new RootStack(app, appName, { env });
