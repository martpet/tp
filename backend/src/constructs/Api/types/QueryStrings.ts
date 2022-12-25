import { ConditionalKeys } from 'type-fest';

import { apiOptions } from '~/consts';
import { ApiRouteOptions } from '~/types';

type RouteWithQueryStrings = ConditionalKeys<
  typeof apiOptions,
  Pick<ApiRouteOptions, 'queryStrings'>
>;

export type QueryStrings<T extends RouteWithQueryStrings> = Partial<
  Record<typeof apiOptions[T]['queryStrings'][number], string>
>;
