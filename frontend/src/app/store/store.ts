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

import { api, publicDirApi } from '~/app/services';
import { appSlice, meSlice, settingsSlice } from '~/features';

import { listenerMiddleware, loggerMiddleware } from './middleware';
import { appPersistConfig, mePersistConfig } from './persistConfigs';

export const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [publicDirApi.reducerPath]: publicDirApi.reducer,
  [appSlice.name]: persistReducer(appPersistConfig, appSlice.reducer),
  [meSlice.name]: persistReducer(mePersistConfig, meSlice.reducer),
  [settingsSlice.name]: settingsSlice.reducer,
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
      .concat(loggerMiddleware, api.middleware, publicDirApi.middleware),
});

export const persistor = persistStore(store);
