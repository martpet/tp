import { ConditionalKeys } from 'type-fest';

import { apiOptions } from '~/consts';
import { ApiPathOptions } from '~/types';

export type PathWithCookies = ConditionalKeys<
  typeof apiOptions,
  Pick<ApiPathOptions, 'cookies'>
>;

export type EndpointCookies<T extends PathWithCookies> = Partial<
  Record<typeof apiOptions[T]['cookies'][number], string>
>;

export type AllEndpointsCookies = EndpointCookies<PathWithCookies>;
