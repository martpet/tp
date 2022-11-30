import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import deepmerge from 'deepmerge';

import { DefaultGlobalLambdaProps, GlobalLambdaProps } from '~/constructs/types';
import { getEnvName, objectValuesToJson } from '~/utils';

import { getMainLayer } from './lambdaLayers';

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

  const mainLayer = getMainLayer(scope);

  const defaultProps: NodejsFunctionProps = {
    runtime: Runtime.NODEJS_18_X,
    layers: [mainLayer],
    bundling: {
      minify: true,
      sourceMap: false,
      externalModules: ['lambda-layer'],
      define: objectValuesToJson({
        // todo: add global variables via the lambda layer as process.env
        ...defaultGlobalProps,
        ...globalProps,
      }),
    },
  };

  const finalProps = deepmerge(defaultProps, props, { clone: false });

  return new NodejsFunction(scope, id, finalProps);
};
