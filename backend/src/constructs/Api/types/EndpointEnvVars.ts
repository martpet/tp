import { ConditionalKeys } from 'type-fest';

import { apiOptions } from '~/consts';
import { ApiPathOptions } from '~/types';

type PathWithEnvVars = ConditionalKeys<
  typeof apiOptions,
  Pick<ApiPathOptions, 'envVars'>
>;

export type EndpointEnvVars<T extends PathWithEnvVars> = Partial<
  Record<typeof apiOptions[T]['envVars'][number], string>
>;

export type AllEndpointsEnvVars = Required<EndpointEnvVars<PathWithEnvVars>>;
