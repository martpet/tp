import { Exact, ValueOf } from 'type-fest';

import { apiPaths } from '~/consts';

export type ApiPath = ValueOf<typeof apiPaths>;

export type FromApiPaths<T extends Exact<Partial<Record<ApiPath, unknown>>, T>> = T;
