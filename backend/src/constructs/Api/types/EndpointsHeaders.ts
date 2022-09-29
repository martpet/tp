import { Merge } from 'type-fest';

import { ApiPathMap } from '~/constructs/Api/types/ApiPathMap';
import { ApiPath } from '~/types';

export type EndpointsHeaders = ApiPathMap<{
  '/logout': ['referer'];
}>;

type AllEndpontsHeaders = Merge<{ [K in ApiPath]: [] }, EndpointsHeaders>;

export type EventHeaders<T extends ApiPath> = Partial<
  Record<[...AllEndpontsHeaders[T], AuthorizationHeader][number], string>
>;

export type AuthorizationHeader = 'authorization';
