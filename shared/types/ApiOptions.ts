import { RequireAtLeastOne } from 'type-fest';

export type ApiOptions = Record<string, ApiRouteOptions>;

export type ApiRouteOptions = {
  methods: RequireAtLeastOne<Record<ApiMethod, ApiMethodOptions>>;
  cookies?: Readonly<string[]>;
  queryStrings?: Readonly<string[]>;
  headers?: Readonly<string[]>;
};

export type ApiMethod = 'GET' | 'POST' | 'PATCH';

export const envVarsKey = 'envVars';

export type ApiMethodOptions = {
  isPublic?: boolean;
  [envVarsKey]?: Readonly<string[]>;
};
