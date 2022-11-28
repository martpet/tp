import { api } from '~/app/services';
import { apiPaths } from '~/common/consts';
import { PatchSettingsRequestBody, PatchSettingsResponseBody } from '~/common/types';

export const settingsApi = api.injectEndpoints({
  endpoints: (build) => ({
    updateSettings: build.mutation<PatchSettingsResponseBody, PatchSettingsRequestBody>({
      query: (body) => ({
        url: apiPaths.settings,
        method: 'PATCH',
        body,
      }),
    }),
  }),
});
