import { api } from '~/app/services';
import { apiPaths } from '~/common/consts';
import { GetMeResponse } from '~/common/types';

const meApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<GetMeResponse, void>({
      query: () => apiPaths.me,
    }),
  }),
});

export const { getMe } = meApi.endpoints;
