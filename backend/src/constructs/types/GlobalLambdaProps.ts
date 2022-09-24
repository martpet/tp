import { JsonValue, Schema } from 'type-fest';

import { EnvName } from '~/types';

declare global {
  var globalLambda: {
    cdkEnv: EnvName;
  };
}

export type GlobalLambdaProps = Partial<{
  [K in keyof typeof globalThis]: Schema<typeof globalThis[K], JsonValue>;
}>;

export type DefaultGlobalLambdaProps = Pick<GlobalLambdaProps, 'globalLambda'>;
