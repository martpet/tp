import { ConditionalKeys } from 'type-fest';

import { apiRoutes } from '~/consts';
import { ApiRouteOptions } from '~/types';

type RouteWithQueryStrings = ConditionalKeys<
  typeof apiRoutes,
  Pick<ApiRouteOptions, 'queryStrings'>
>;

export type ApiRouteQueryStrings<T extends RouteWithQueryStrings> = Partial<
  Record<typeof apiRoutes[T]['queryStrings'][number], string>
>;
