import { Exact } from 'type-fest';

import { ApiPath } from '~/types';

export type ApiPathMap<T extends Exact<Partial<Record<ApiPath, unknown>>, T>> = T;
