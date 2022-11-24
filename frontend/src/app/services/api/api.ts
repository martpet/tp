import { createApi } from '@reduxjs/toolkit/query';

import { apiUrl } from '~/common/consts';

import { createBaseQuery } from './baseQuery';

export const api = createApi({
  baseQuery: createBaseQuery({
    baseUrl: apiUrl,
    credentials: 'include',
  }),
  endpoints: () => ({}),
});
