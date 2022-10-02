import storage from 'redux-persist/es/storage';

import { appSlice, AppState } from '~/app/App';
import { meSlice, MeState } from '~/features/me';

export const mePersistConfig = {
  key: meSlice.name,
  storage,
  whitelist: <(keyof MeState)[]>['isSignedIn'],
};

export const appPersistConfig = {
  key: appSlice.name,
  storage,
  whitelist: <(keyof AppState)[]>['language'],
};
