import { Fn } from 'aws-cdk-lib';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

import { CrossAccountSSM } from './CrossAccountSSM';

type OAuthSecretsProps = {
  roleArn?: string;
  ssmParamsNames: {
    google: string;
    apple: string;
  };
};

export class OAuthSecrets extends Construct {
  public readonly appleSecret: string;

  public readonly googleSecret: string;

  constructor(
    scope: Construct,
    id: string,
    { roleArn, ssmParamsNames }: OAuthSecretsProps
  ) {
    super(scope, id);

    if (roleArn) {
      const { values } = new CrossAccountSSM(scope, 'CrossAccount', {
        roleArn,
        getParametersInput: {
          Names: [ssmParamsNames.apple, ssmParamsNames.google],
        },
      });
      this.appleSecret = Fn.select(0, values);
      this.googleSecret = Fn.select(1, values);
    } else {
      this.appleSecret = StringParameter.fromStringParameterAttributes(
        scope,
        'AppleSecret',
        { parameterName: ssmParamsNames.apple }
      ).stringValue;

      this.googleSecret = StringParameter.fromStringParameterAttributes(
        scope,
        'GoogleSecret',
        { parameterName: ssmParamsNames.google }
      ).stringValue;
    }
  }
}
