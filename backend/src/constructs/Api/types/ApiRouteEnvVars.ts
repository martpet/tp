import { ConditionalKeys } from 'type-fest';

import { apiRoutes } from '~/consts';
import { ApiRouteOptions } from '~/types';

type PathWithEnvVars = ConditionalKeys<
  typeof apiRoutes,
  Pick<ApiRouteOptions, 'envVars'>
>;

export type ApiRouteEnvVars<T extends PathWithEnvVars> = Partial<
  Record<typeof apiRoutes[T]['envVars'][number], string>
>;

export type AllApiRoutesEnvVars = Required<ApiRouteEnvVars<PathWithEnvVars>>;
