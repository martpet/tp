import { Merge } from 'type-fest';

import { ApiPath, OnlyApiPaths } from '~/types';

export type EndpointsHeaders = OnlyApiPaths<{
  '/logout': ['referer'];
}>;

type AllEndpontsHeaders = Merge<{ [K in ApiPath]: [] }, EndpointsHeaders>;

export type EventHeaders<T extends ApiPath> = Partial<
  Record<[...AllEndpontsHeaders[T], AuthorizationHeader][number], string>
>;

export type AuthorizationHeader = 'authorization';
