import { api } from '~/app/services';
import { apiPaths } from '~/common/consts';
import { PatchSettingsRequest, PatchSettingsResponse } from '~/common/types';

const settingsApi = api.injectEndpoints({
  endpoints: (build) => ({
    updateSettings: build.mutation<PatchSettingsResponse, PatchSettingsRequest>({
      query: (body) => ({
        url: apiPaths.settings,
        method: 'PATCH',
        body,
      }),
    }),
  }),
});

export const { updateSettings } = settingsApi.endpoints;
