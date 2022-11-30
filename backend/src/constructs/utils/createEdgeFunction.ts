import { TypeScriptCode } from '@mrgrain/cdk-esbuild';
import { experimental } from 'aws-cdk-lib/aws-cloudfront';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { appName } from 'lambda-layer';

import { DefaultGlobalLambdaProps, GlobalLambdaProps } from '~/constructs/types';
import { getEnvName, objectValuesToJson } from '~/utils';

type CreateEdgeFunctionProps = Partial<experimental.EdgeFunctionProps> & {
  entry: string;
  globalProps?: GlobalLambdaProps;
};

export const createEdgeFunction = (
  scope: Construct,
  id: string,
  { globalProps, entry, functionName, ...props }: CreateEdgeFunctionProps
) => {
  const fileName = entry.split('/').at(-1)?.split('.ts')[0];

  const defaultGlobalProps: DefaultGlobalLambdaProps = {
    globalLambdaProps: {
      envName: getEnvName(scope),
    },
  };

  // const mainLayer = getMainLayer(scope);

  return new experimental.EdgeFunction(scope, id, {
    handler: `${fileName}.handler`,
    // todo: change to 18 when supported by EdgeLambda:
    // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions-restrictions.html#lambda-at-edge-runtime-restrictions
    runtime: Runtime.NODEJS_16_X,
    functionName: functionName ? `${appName}-edge-lambda-${functionName}` : undefined,

    // Cannot mainLayer from eu-west-1 -- edge stack needs `crossRegionReferences`:
    // "Cross stack references are only supported for stacks deployed to the same environment or between nested stacks and their parent stack. Set crossRegionReferences=true to enable cross region references"
    // layers: [mainLayer],
    ...props,
    code: new TypeScriptCode(entry, {
      buildOptions: {
        // external: ['lambda-layer'],
        minify: true,
        sourcemap: false,
        define: objectValuesToJson({
          ...defaultGlobalProps,
          ...globalProps,
        }),
      },
    }),
  });
};
