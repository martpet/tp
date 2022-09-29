import { combineReducers, configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
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
import storage from 'redux-persist/lib/storage';

import { api } from '~/app';
import { meSlice, MeState } from '~/features/me';

import { api401ResponseMiddleware, listenerMiddleware } from './middleware';

const mePersistConfig = {
  key: meSlice.name,
  storage,
  whitelist: <(keyof MeState)[]>['hasSession'],
};

export const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [meSlice.name]: persistReducer(mePersistConfig, meSlice.reducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .prepend(listenerMiddleware.middleware)
      .concat(logger, api.middleware, api401ResponseMiddleware),
});

export const persistor = persistStore(store);
