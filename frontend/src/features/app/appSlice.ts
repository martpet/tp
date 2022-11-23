import { createSlice } from '@reduxjs/toolkit';

import {
  matchCompletedQueryWithAppLoader,
  matchPendingQueryWithAppLoader,
} from '~/app/store/actionMatchers';
import { RootState } from '~/common/types';

// Selectors
export const selectHasPendingQueriesWithLoader = (state: RootState) =>
  state.app.pendingQueriesWithLoader > 0;

// Slice
export type AppState = {
  pendingQueriesWithLoader: number;
  browserLocale: string;
};

const initialState: AppState = {
  pendingQueriesWithLoader: 0,
  browserLocale: window.navigator.language,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    browserLocaleChanged: (state) => {
      state.browserLocale = window.navigator.language;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(matchPendingQueryWithAppLoader, (state) => {
      state.pendingQueriesWithLoader++;
    });
    builder.addMatcher(matchCompletedQueryWithAppLoader, (state) => {
      state.pendingQueriesWithLoader--;
    });
  },
});

// Actions
export const { browserLocaleChanged } = appSlice.actions;
