import { authorizationHeader } from '~/constructs/Api/consts';
import { apiOptions } from '~/consts';
import { ApiPathOptions } from '~/types';

export type EndpointHeaders<T extends keyof typeof apiOptions> = Partial<
  Record<
    | Lowercase<typeof authorizationHeader>
    | (typeof apiOptions[T] extends Required<Pick<ApiPathOptions, 'headers'>>
        ? typeof apiOptions[T]['headers'][number]
        : never),
    string
  >
>;
