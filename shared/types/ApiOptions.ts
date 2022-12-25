import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ReadonlyDeep, RequireAtLeastOne } from 'type-fest';

export type ApiOptions = Record<string, ApiRouteOptions>;

export type ApiRouteOptions = {
  methods: RequireAtLeastOne<Record<ApiMethod, ApiMethodOptions>>;
  cookies?: Readonly<string[]>;
  queryStrings?: Readonly<string[]>;
  headers?: Readonly<string[]>;
  cacheProps?: {
    minTtl?: number;
    maxTtl?: number;
    defaultTtl?: number;
  };
};

export type ApiMethod = 'GET' | 'POST' | 'PATCH';

export type ApiMethodOptions = {
  isPublic?: boolean;
  pathParam?: string;
  envVars?: Readonly<string[]>;
  nodejsFunctionProps?: ReadonlyDeep<NodejsFunctionProps>;
};
