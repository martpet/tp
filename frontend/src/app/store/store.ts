import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

import { api, appSlice } from '~/app';
import { meSlice } from '~/features/me';

import { listenerMiddleware } from './middleware';
import { appPersistConfig, mePersistConfig } from './persistConfigs';

export const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [meSlice.name]: persistReducer(mePersistConfig, meSlice.reducer),
  [appSlice.name]: persistReducer(appPersistConfig, appSlice.reducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .prepend(listenerMiddleware)
      .concat(api.middleware),
});

export const persistor = persistStore(store);
