import { authorizationHeader } from '~/constructs/Api/consts';
import { apiRoutes } from '~/consts';
import { ApiRouteOptions } from '~/types';

export type ApiRouteHeaders<T extends keyof typeof apiRoutes> = Partial<
  Record<
    | Lowercase<typeof authorizationHeader>
    | (typeof apiRoutes[T] extends Required<Pick<ApiRouteOptions, 'headers'>>
        ? typeof apiRoutes[T]['headers'][number]
        : never),
    string
  >
>;
