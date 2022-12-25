import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { appEnvs, appName } from '~/consts';
import { EnvName } from '~/types';

import { RootStack } from './RootStack';

// This test is skipped until issues are fixed:
// https://github.com/aws/aws-cdk/issues/20873
// https://github.com/vitest-dev/vitest§§§/issues/1544
describe('RootStack', () => {
  it.skip('produces a correct CloudFormation template', () => {
    const envName: EnvName = 'production';
    const app = new App({ context: { envName } });
    const { env } = appEnvs[envName];
    const stack = new RootStack(app, appName, { env });
    const template = Template.fromStack(stack);

    expect(template.toJSON()).toMatchSnapshot();
  });
});
