import { createApi } from '@reduxjs/toolkit/query';

import { apiUrl } from '~/common/consts';

import { customBaseQuery } from './customBaseQuery';

export const api = createApi({
  baseQuery: customBaseQuery({
    baseUrl: apiUrl,
    credentials: 'include',
  }),
  endpoints: () => ({}),
});
