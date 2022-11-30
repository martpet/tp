import { CustomResource, Stack } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

import { createNodejsFunction } from '~/constructs/utils';

import { ResourceProps } from './lambda/crossRegionSNSTopic.handler';

export class CrossRegionSNSTopic extends Construct {
  readonly arn: string;

  constructor(scope: Construct, id: string, props: ResourceProps) {
    super(scope, id);

    const properties = structuredClone(props);
    const { stackName } = Stack.of(this);

    properties.createTopicInput.Name = `${stackName}-${properties.createTopicInput.Name}`;

    const onEventHandler = createNodejsFunction(this, 'handler', {
      entry: `${__dirname}/lambda/crossRegionSNSTopic.handler.ts`,
      functionName: `custom-resource-handler--cross-region-sns-topic`,
    });

    const policy = new PolicyStatement({
      actions: ['sns:CreateTopic', 'sns:DeleteTopic', 'sns:Subscribe'],
      resources: ['*'],
    });

    onEventHandler.addToRolePolicy(policy);

    const provider = new Provider(this, 'provider', { onEventHandler });

    const customResource = new CustomResource(this, 'custom-resource', {
      serviceToken: provider.serviceToken,
      properties,
    });

    this.arn = customResource.getAttString('TopicArn');
  }
}
