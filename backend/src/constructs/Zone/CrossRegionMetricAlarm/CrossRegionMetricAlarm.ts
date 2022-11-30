import { CustomResource, Stack } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

import { createNodejsFunction } from '~/constructs/utils';

import { ResourceProps } from './lambda/crossRegionMetricAlarm.handler';

export class CrossRegionMetricAlarm extends Construct {
  constructor(scope: Construct, id: string, props: ResourceProps) {
    super(scope, id);

    const properties = structuredClone(props);
    const { stackName } = Stack.of(this);

    properties.putMetricAlarmInput.AlarmName = `${stackName}-${properties.putMetricAlarmInput.AlarmName}`;

    const onEventHandler = createNodejsFunction(this, 'handler', {
      entry: `${__dirname}/lambda/crossRegionMetricAlarm.handler.ts`,
      functionName: `custom-resource-handler--cross-region-metric-alarm`,
    });

    const policy = new PolicyStatement({
      actions: ['cloudwatch:PutMetricAlarm', 'cloudwatch:DeleteAlarms'],
      resources: ['*'],
    });

    onEventHandler.addToRolePolicy(policy);

    const { serviceToken } = new Provider(this, 'provider', { onEventHandler });

    new CustomResource(this, 'custom-resource', {
      serviceToken,
      properties,
    });
  }
}
