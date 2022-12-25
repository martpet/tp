import { TypeScriptCode } from '@mrgrain/cdk-esbuild';
import { ILayerVersion, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

import { DefaultGlobalLambdaProps } from '~/constructs/types';
import { getEnvName, objectValuesToJson } from '~/utils';

let mainLayer: ILayerVersion | undefined;

export const getMainLayer = (scope: Construct) => {
  const defaultGlobalProps: DefaultGlobalLambdaProps = {
    globalLambdaProps: {
      envName: getEnvName(scope),
    },
  };

  if (!mainLayer) {
    mainLayer = new LayerVersion(scope, 'main-lambda-layer', {
      layerVersionName: 'lambda-layer',
      compatibleRuntimes: [Runtime.NODEJS_18_X],
      code: new TypeScriptCode(`${__dirname}/code/main-layer.ts`, {
        buildOptions: {
          outfile: 'nodejs/node_modules/lambda-layer/index.js',
          minify: true,
          sourcemap: false,
          define: objectValuesToJson({
            ...defaultGlobalProps,
          }),
        },
      }),
    });
  }
  return mainLayer;
};
