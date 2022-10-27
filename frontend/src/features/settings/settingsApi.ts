import { api } from '~/app/services';
import { apiPaths } from '~/common/consts';
import { PatchSettingsResponse, UserSettings } from '~/common/types';

export const settingsApi = api.injectEndpoints({
  endpoints: (build) => ({
    updateSettings: build.mutation<PatchSettingsResponse, UserSettings>({
      query: (body) => ({
        url: apiPaths.settings,
        method: 'PATCH',
        body,
      }),
    }),
  }),
});
