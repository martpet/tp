import { RequireAtLeastOne } from 'type-fest';

export type ApiOptions = Record<string, ApiPathOptions>;

export type ApiMethod = 'GET' | 'POST';

export type ApiMethodsOptions = RequireAtLeastOne<
  Record<ApiMethod, { isPublic?: boolean }>
>;

export type ApiPathOptions = {
  methods: ApiMethodsOptions;
  cookies?: Readonly<string[]>;
  queryStrings?: Readonly<string[]>;
  headers?: Readonly<string[]>;
  envVars?: Readonly<string[]>;
};
