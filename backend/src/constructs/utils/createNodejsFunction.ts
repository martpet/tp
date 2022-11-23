import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import deepmerge from 'deepmerge';

import { DefaultGlobalLambdaProps, GlobalLambdaProps } from '~/constructs/types';
import { getEnvName, objectValuesToJson } from '~/utils';

type CreateNodejsFunctionProps = NodejsFunctionProps & {
  globalProps?: GlobalLambdaProps;
};

export const createNodejsFunction = (
  scope: Construct,
  id: string,
  { globalProps, ...props }: CreateNodejsFunctionProps
) => {
  const defaultGlobalProps: DefaultGlobalLambdaProps = {
    globalLambdaProps: {
      envName: getEnvName(scope),
    },
  };

  const defaultProps: NodejsFunctionProps = {
    runtime: Runtime.NODEJS_18_X,
    bundling: {
      externalModules: ['@aws-sdk/*'],
      minify: true,
      define: objectValuesToJson({
        ...defaultGlobalProps,
        ...globalProps,
      }),
    },
  };

  const finalProps = deepmerge(defaultProps, props);

  return new NodejsFunction(scope, id, finalProps);
};
