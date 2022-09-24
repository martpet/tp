import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import deepmerge from 'deepmerge';

import { DefaultGlobalLambdaProps, GlobalLambdaProps } from '~/constructs/types';
import { getEnvName, objectValuesToJson } from '~/utils';

type CreateNodejsFunctionProps = NodejsFunctionProps & {
  globalLambdaProps?: GlobalLambdaProps;
};

export const createNodejsFunction = (
  scope: Construct,
  id: string,
  { globalLambdaProps, ...props }: CreateNodejsFunctionProps
) => {
  const defaultGlobalLambdaProps: DefaultGlobalLambdaProps = {
    globalLambdaProps: {
      envName: getEnvName(scope),
    },
  };

  const defaultProps: NodejsFunctionProps = {
    runtime: Runtime.NODEJS_16_X,
    bundling: {
      minify: true,
      define: objectValuesToJson({
        ...defaultGlobalLambdaProps,
        ...globalLambdaProps,
      }),
    },
  };

  const finalProps = deepmerge(defaultProps, props);

  return new NodejsFunction(scope, id, finalProps);
};
