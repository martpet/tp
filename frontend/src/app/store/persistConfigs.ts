import { PersistConfig } from 'redux-persist';
import storage from 'redux-persist/es/storage';

import { appSlice, AppState, meSlice, MeState } from '~/features';

export const appPersistConfig: PersistConfig<AppState> = {
  key: appSlice.name,
  storage,
  whitelist: <Array<keyof AppState>>['language', 'colorScheme'],
};

export const mePersistConfig: PersistConfig<MeState> = {
  key: meSlice.name,
  storage,
  whitelist: <Array<keyof MeState>>['isSignedIn'],
};
