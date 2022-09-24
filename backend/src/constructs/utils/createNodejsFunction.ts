import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import deepmerge from 'deepmerge';

import { EnvName } from '~/types';
import { getEnvName } from '~/utils';

declare global {
  var cdkContextEnv: EnvName;
}

export const createNodejsFunction = (
  scope: Construct,
  id: string,
  props: NodejsFunctionProps
) => {
  const defaultProps: NodejsFunctionProps = {
    runtime: Runtime.NODEJS_16_X,
    bundling: {
      minify: true,
      esbuildArgs: {
        '--define:cdkContextEnv': getEnvName(scope),
      },
    },
  };

  const finalProps = deepmerge(defaultProps, props);

  return new NodejsFunction(scope, id, finalProps);
};
