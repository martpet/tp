import { TypeScriptCode } from '@mrgrain/cdk-esbuild';
import { experimental } from 'aws-cdk-lib/aws-cloudfront';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { JsonValue, Schema } from 'type-fest';

import { getEnvName, objectValuesToJson } from '~/utils';

type CreateEdgeFunctionProps = Partial<experimental.EdgeFunctionProps> & {
  entry: string;
  buildOptionsDefine?: BuildOptionsDefine;
};

type BuildOptionsDefine = Partial<{
  [K in keyof typeof globalThis]: Schema<typeof globalThis[K], JsonValue>;
}>;

export const createEdgeFunction = (
  scope: Construct,
  id: string,
  { buildOptionsDefine, entry, ...props }: CreateEdgeFunctionProps
) => {
  const fileName = entry.split('/').at(-1)?.split('.ts')[0];
  const defaultBuildOptionsDefine: BuildOptionsDefine = {
    cdkContextEnv: getEnvName(scope),
  };

  return new experimental.EdgeFunction(scope, id, {
    handler: `${fileName}.handler`,
    runtime: Runtime.NODEJS_16_X,
    ...props,
    code: new TypeScriptCode(entry, {
      buildOptions: {
        minify: true,
        define: objectValuesToJson({
          ...defaultBuildOptionsDefine,
          ...buildOptionsDefine,
        }),
      },
    }),
  });
};
