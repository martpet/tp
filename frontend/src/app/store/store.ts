import { autoBatchEnhancer, combineReducers, configureStore } from '@reduxjs/toolkit';
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
import { appSlice, mapSlice, meSlice, settingsSlice, uploadSlice } from '~/features';

import { listenerMiddleware } from './middleware';
import {
  mapPersistConfig,
  mePersistConfig,
  settingsPersistConfig,
} from './persistConfigs';

export const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [publicDirApi.reducerPath]: publicDirApi.reducer,
  [appSlice.name]: appSlice.reducer,
  [meSlice.name]: persistReducer(mePersistConfig, meSlice.reducer),
  [settingsSlice.name]: persistReducer(settingsPersistConfig, settingsSlice.reducer),
  [uploadSlice.name]: uploadSlice.reducer,
  [mapSlice.name]: persistReducer(mapPersistConfig, mapSlice.reducer),
});

export const store = configureStore({
  reducer: rootReducer,
  enhancers: (existingEnhancers) => {
    return existingEnhancers.concat(autoBatchEnhancer());
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .prepend(listenerMiddleware)
      .concat(api.middleware, publicDirApi.middleware),
});

export const persistor = persistStore(store);
