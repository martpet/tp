import { RequireAtLeastOne } from 'type-fest';

export type ApiRoutes = Record<string, ApiRouteOptions>;

export type ApiMethod = 'GET' | 'POST' | 'PATCH';

export type ApiMethodsOptions = RequireAtLeastOne<
  Record<ApiMethod, { isPublic?: boolean }>
>;

export type ApiRouteOptions = {
  methods: ApiMethodsOptions;
  cookies?: Readonly<string[]>;
  queryStrings?: Readonly<string[]>;
  headers?: Readonly<string[]>;
  envVars?: Readonly<string[]>;
};
