import { JsonValue, Schema } from 'type-fest';

import { EnvName } from '~/types';

declare global {
  var globalLambdaProps: {
    envName: EnvName;
  };
}

export type GlobalLambdaProps = Partial<{
  [K in keyof typeof globalThis]: Schema<typeof globalThis[K], JsonValue>;
}>;

export type DefaultGlobalLambdaProps = Pick<GlobalLambdaProps, 'globalLambdaProps'>;
