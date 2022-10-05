import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { AppLanguage, TranslationMessages } from '~/common/types';

export const publicDirApi = createApi({
  reducerPath: 'publicDirApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
  }),
  endpoints: ({ query }) => ({
    getTranslations: query<TranslationMessages, AppLanguage>({
      query: (language) => `/translations/${language}.json`,
    }),
  }),
});
