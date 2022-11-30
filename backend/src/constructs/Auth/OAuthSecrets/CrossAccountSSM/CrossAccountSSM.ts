import { CustomResource, Token } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

import { createNodejsFunction } from '~/constructs/utils';

import { ResourceProps } from './lambda/crossAccountSSM.handler';

export class CrossAccountSSM extends Construct {
  readonly values: string[];

  constructor(scope: Construct, id: string, props: ResourceProps) {
    super(scope, id);

    const properties = structuredClone(props);

    properties.getParametersInput.WithDecryption ??= true;

    const onEventHandler = createNodejsFunction(this, 'handler', {
      entry: `${__dirname}/lambda/crossAccountSSM.handler.ts`,
      functionName: `custom-resource-handler--cross-account-ssm`,
    });

    const policy = new PolicyStatement({
      actions: ['sts:AssumeRole'],
      resources: [properties.roleArn],
    });

    onEventHandler.addToRolePolicy(policy);

    const { serviceToken } = new Provider(this, 'provider', { onEventHandler });

    const customResource = new CustomResource(this, 'custom-resource', {
      serviceToken,
      properties,
    });

    this.values = Token.asList(customResource.getAtt('values'));
  }
}
