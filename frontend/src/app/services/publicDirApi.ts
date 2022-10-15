import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ResolvedIntlConfig } from 'react-intl';

import { Language } from '~/common/types';

export const publicDirApi = createApi({
  reducerPath: 'publicDirApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
  }),
  endpoints: ({ query }) => ({
    getTranslations: query<ResolvedIntlConfig['messages'], Language>({
      query: (language) => `/compiled-lang/${language}.json`,
    }),
  }),
});
