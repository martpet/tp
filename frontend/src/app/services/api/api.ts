import { createApi } from '@reduxjs/toolkit/query';

import { apiUrl } from '~/common/consts';

import { baseQueryWithReauth } from './baseQueryWithReauth';

export const api = createApi({
  baseQuery: baseQueryWithReauth({
    baseUrl: apiUrl,
    credentials: 'include',
  }),
  endpoints: () => ({}),
});
