import { PersistConfig } from 'redux-persist';
import storage from 'redux-persist/es/storage';

import {
  appSlice,
  mapSlice,
  MapState,
  meSlice,
  MeState,
  SettingsState,
} from '~/features';

export const settingsPersistConfig: PersistConfig<SettingsState> = {
  key: appSlice.name,
  storage,
  whitelist: <Array<keyof SettingsState>>['userSettings'],
};

export const mePersistConfig: PersistConfig<MeState> = {
  key: meSlice.name,
  storage,
  whitelist: <Array<keyof MeState>>['isLoggedIn'],
};

export const mapPersistConfig: PersistConfig<MapState> = {
  key: mapSlice.name,
  storage,
  whitelist: <Array<keyof MapState>>['view'],
};
