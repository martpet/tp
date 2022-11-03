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
import { uploadSlice } from '~/features/upload';

import { listenerMiddleware, loggerMiddleware } from './middleware';
import { mePersistConfig, settingsPersistConfig } from './persistConfigs';

export const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [publicDirApi.reducerPath]: publicDirApi.reducer,
  [appSlice.name]: appSlice.reducer,
  [meSlice.name]: persistReducer(mePersistConfig, meSlice.reducer),
  [settingsSlice.name]: persistReducer(settingsPersistConfig, settingsSlice.reducer),
  [uploadSlice.name]: uploadSlice.reducer,
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
