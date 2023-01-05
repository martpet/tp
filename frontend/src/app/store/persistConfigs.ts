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

import { mapViewTransform } from './persistTransforms';

export const settingsPersistConfig: PersistConfig<SettingsState> = {
  key: appSlice.name,
  storage,
  whitelist: <(keyof SettingsState)[]>['userSettings'],
};

export const mePersistConfig: PersistConfig<MeState> = {
  key: meSlice.name,
  storage,
  whitelist: <(keyof MeState)[]>['isLoggedIn'],
};

export const mapPersistConfig: PersistConfig<MapState> = {
  key: mapSlice.name,
  storage,
  whitelist: <(keyof MapState)[]>['view'],
  transforms: [mapViewTransform],
};
