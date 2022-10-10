import { ConditionalKeys } from 'type-fest';

import { apiOptions } from '~/consts';
import { ApiPathOptions } from '~/types';

type PathWithQueryStrings = ConditionalKeys<
  typeof apiOptions,
  Pick<ApiPathOptions, 'queryStrings'>
>;

export type EndpointQueryStrings<T extends PathWithQueryStrings> = Partial<
  Record<typeof apiOptions[T]['queryStrings'][number], string>
>;
