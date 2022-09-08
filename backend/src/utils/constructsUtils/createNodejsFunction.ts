import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import deepmerge from 'deepmerge';

export const createNodejsFunction = (
  scope: Construct,
  id: string,
  props: NodejsFunctionProps
) => {
  const defaultProps: NodejsFunctionProps = {
    runtime: Runtime.NODEJS_16_X,
    bundling: {
      minify: true,
    },
  };

  const finalProps = deepmerge(defaultProps, props);

  return new NodejsFunction(scope, id, finalProps);
};
