import { authorizationHeader } from '~/constructs/Api/consts';
import { apiOptions } from '~/consts';
import { ApiRouteOptions } from '~/types';

export type RouteHeaders<T extends keyof typeof apiOptions> = Partial<
  Record<
    | Lowercase<typeof authorizationHeader>
    | (typeof apiOptions[T] extends Required<Pick<ApiRouteOptions, 'headers'>>
        ? typeof apiOptions[T]['headers'][number]
        : never),
    string
  >
>;
