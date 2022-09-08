import { FromApiPaths } from '~/types';

export type EndpointsHeaders = FromApiPaths<{
  '/logout': ['referer'];
}>;

export type RequestHeaders<T extends keyof EndpointsHeaders> = Partial<
  Record<EndpointsHeaders[T][number], string>
>;
