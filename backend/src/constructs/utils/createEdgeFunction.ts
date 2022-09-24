import { TypeScriptCode } from '@mrgrain/cdk-esbuild';
import { experimental } from 'aws-cdk-lib/aws-cloudfront';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

import { DefaultGlobalLambdaProps, GlobalLambdaProps } from '~/constructs/types';
import { getEnvName, objectValuesToJson } from '~/utils';

type CreateEdgeFunctionProps = Partial<experimental.EdgeFunctionProps> & {
  entry: string;
  globalLambdaProps?: GlobalLambdaProps;
};

export const createEdgeFunction = (
  scope: Construct,
  id: string,
  { globalLambdaProps, entry, ...props }: CreateEdgeFunctionProps
) => {
  const fileName = entry.split('/').at(-1)?.split('.ts')[0];
  const defaultGlobalLambdaProps: DefaultGlobalLambdaProps = {
    globalLambda: {
      cdkEnv: getEnvName(scope),
    },
  };

  return new experimental.EdgeFunction(scope, id, {
    handler: `${fileName}.handler`,
    runtime: Runtime.NODEJS_16_X,
    ...props,
    code: new TypeScriptCode(entry, {
      buildOptions: {
        minify: true,
        define: objectValuesToJson({
          ...defaultGlobalLambdaProps,
          ...globalLambdaProps,
        }),
      },
    }),
  });
};
