import { ConditionalKeys } from 'type-fest';

import { apiOptions } from '~/consts';
import { ApiRouteOptions } from '~/types';

export type PathWithCookies = ConditionalKeys<
  typeof apiOptions,
  Pick<ApiRouteOptions, 'cookies'>
>;

export type Cookies<T extends PathWithCookies> = Partial<
  Record<typeof apiOptions[T]['cookies'][number], string>
>;

export type AllCookies = Cookies<PathWithCookies>;
