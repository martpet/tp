import { TypeScriptCode } from '@mrgrain/cdk-esbuild';
import { ILayerVersion, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

let mainLayer: ILayerVersion | undefined;

export const getMainLayer = (scope: Construct) => {
  if (!mainLayer) {
    mainLayer = new LayerVersion(scope, 'MainLambdaLayer', {
      layerVersionName: 'main-layer',
      compatibleRuntimes: [Runtime.NODEJS_18_X],
      code: new TypeScriptCode(`${__dirname}/code/main-layer.ts`, {
        buildOptions: {
          outfile: 'nodejs/node_modules/lambda-layer/index.js',
          minify: true,
          sourcemap: false,
        },
      }),
    });
  }
  return mainLayer;
};
