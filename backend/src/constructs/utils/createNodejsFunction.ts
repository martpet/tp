import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import deepmerge from 'deepmerge';
import { Writable } from 'type-fest';

import { DefaultGlobalLambdaProps, GlobalLambdaProps } from '~/constructs/types';
import { appName } from '~/consts';
import { getEnvName, objectValuesToJson } from '~/utils';

import { getMainLayer } from './lambdaLayers';

type CreateNodejsFunctionProps = NodejsFunctionProps & {
  globalProps?: GlobalLambdaProps;
};

export const createNodejsFunction = (
  scope: Construct,
  id: string,
  { globalProps, functionName, ...props }: CreateNodejsFunctionProps
) => {
  const defaultGlobalProps: DefaultGlobalLambdaProps = {
    globalLambdaProps: {
      envName: getEnvName(scope),
    },
  };

  const mainLayer = getMainLayer(scope);
  const envName = getEnvName(scope);

  const defaultProps: NodejsFunctionProps = {
    runtime: Runtime.NODEJS_18_X,
    memorySize: 128,
    layers: [mainLayer],
    functionName: functionName ? `${appName}-${functionName}` : undefined,
    environment: {
      NODE_OPTIONS: '--enable-source-maps',
    },
    bundling: {
      minify: true,
      sourceMap: true,
      externalModules: ['lambda-layer'],
      define: objectValuesToJson({
        ...defaultGlobalProps,
        ...globalProps,
      }),
    },
  };

  if (envName !== 'personal' && props.bundling) {
    const { bundling } = props;
    (bundling as Writable<typeof bundling>).forceDockerBundling = false;
  }

  const finalProps = deepmerge(defaultProps, props, { clone: false });

  return new NodejsFunction(scope, id, finalProps);
};
