import { RequireAtLeastOne } from 'type-fest';

import { UserSettings } from '~/common/types';

type Props = {
  localSettings: UserSettings;
  remoteSettings: UserSettings;
};

export const getSettingsToSync = ({ localSettings, remoteSettings }: Props) => {
  const settingsKeys = Object.keys(localSettings) as (keyof UserSettings)[];
  const localPatch = {} as RequireAtLeastOne<UserSettings>;
  const remotePatch = {} as RequireAtLeastOne<UserSettings>;

  settingsKeys.forEach((key) => {
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
