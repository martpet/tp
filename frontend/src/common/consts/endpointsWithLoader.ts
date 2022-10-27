import { ApiEndpointQuery } from '@reduxjs/toolkit/dist/query/core/module';

import { meApi } from '~/features/me/meApi';

export const endpointsWithLoader: ApiEndpointQuery<any, any>[] = [meApi.endpoints.getMe];
