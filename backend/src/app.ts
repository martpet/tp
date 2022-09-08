import { App } from 'aws-cdk-lib';

import { appEnvs, appName } from '~/consts';
import { RootStack } from '~/stacks';
import { getEnvName } from '~/utils';

const app = new App();
const { env } = appEnvs[getEnvName(app)];

new RootStack(app, appName, { env });
