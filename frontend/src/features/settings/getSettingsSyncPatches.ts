import { RequireAtLeastOne } from 'type-fest';

import { RootState, UserSettings } from '~/common/types';

export const getSettingsSyncPatches = (state: RootState) => {
  const localSettings = state.settings.userSettings;
  const remoteSettings = state.me.user?.settings as UserSettings;
  const keys = Object.keys(localSettings) as (keyof UserSettings)[];
  const localPatch = {} as RequireAtLeastOne<UserSettings>;
  const remotePatch = {} as RequireAtLeastOne<UserSettings>;

  keys.forEach((key) => {
    const localValue = localSettings[key];
    const remoteValue = remoteSettings[key];

    if (localValue === remoteValue) {
      return;
    }

    if (localValue === undefined) {
      Object.assign(localPatch, { [key]: remoteValue });
    } else {
      Object.assign(remotePatch, { [key]: localValue });
    }
  });

  return {
    localPatch: Object.keys(localPatch).length ? localPatch : undefined,
    remotePatch: Object.keys(remotePatch).length ? remotePatch : undefined,
  };
};
