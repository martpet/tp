import { ApiEndpointQuery } from '@reduxjs/toolkit/dist/query/core/module';

import { meApi } from '~/features/me';

export const endpointsWithLoader: ApiEndpointQuery<any, any>[] = [meApi.endpoints.getMe];
