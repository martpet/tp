import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { apiUrl } from '~/common/consts';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl, credentials: 'include' }),
  endpoints: () => ({}),
});
