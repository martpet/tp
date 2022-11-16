import { ConditionalKeys } from 'type-fest';

import { apiRoutes } from '~/consts';
import { ApiRouteOptions } from '~/types';

export type PathWithCookies = ConditionalKeys<
  typeof apiRoutes,
  Pick<ApiRouteOptions, 'cookies'>
>;

export type ApiRouteCookies<T extends PathWithCookies> = Partial<
  Record<typeof apiRoutes[T]['cookies'][number], string>
>;

export type AllApiRoutesCookies = ApiRouteCookies<PathWithCookies>;
