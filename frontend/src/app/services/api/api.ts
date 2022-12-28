import { createApi } from '@reduxjs/toolkit/query/react';

import { apiPaths, apiUrl } from '~/common/consts';
import { GetPublicCredentialsResponse } from '~/common/types';

import { customBaseQuery } from './customBaseQuery';

export const api = createApi({
  baseQuery: customBaseQuery({
    baseUrl: apiUrl,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getPublicCredentials: builder.query<GetPublicCredentialsResponse, void>({
      query: () => apiPaths['public-credentials'],
    }),
  }),
});

export const { useGetPublicCredentialsQuery } = api;
