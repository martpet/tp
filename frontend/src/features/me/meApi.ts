import { api } from '~/app/services';
import { apiPaths } from '~/common/consts';
import { Me } from '~/common/types';

export const meApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<Me, void>({
      query: () => apiPaths.me,
    }),
  }),
});
