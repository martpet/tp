import { PersistConfig } from 'redux-persist';
import storage from 'redux-persist/es/storage';

import { appSlice, meSlice, MeState, SettingsState } from '~/features';

export const settingsPersistConfig: PersistConfig<SettingsState> = {
  key: appSlice.name,
  storage,
  whitelist: <Array<keyof SettingsState>>['userSettings'],
};

export const mePersistConfig: PersistConfig<MeState> = {
  key: meSlice.name,
  storage,
  whitelist: <Array<keyof MeState>>['isSignedIn'],
};
