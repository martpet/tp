import { PersistConfig } from 'redux-persist';
import storage from 'redux-persist/es/storage';

import { meSlice, MeState } from '~/features/me';

export const mePersistConfig: PersistConfig<MeState> = {
  key: meSlice.name,
  storage,
  whitelist: <Array<keyof MeState>>['isSignedIn'],
};
