import { createSlice } from '@reduxjs/toolkit';

import {
  matchCompletedQueryWithLoader,
  matchPendingQueryWithLoader,
} from '~/app/store/actionMatchers';
import { RootState } from '~/common/types';

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
    builder.addMatcher(matchPendingQueryWithLoader, (state) => {
      state.pendingQueriesWithLoader++;
    });
    builder.addMatcher(matchCompletedQueryWithLoader, (state) => {
      state.pendingQueriesWithLoader--;
    });
  },
});

export const { browserLocaleChanged } = appSlice.actions;

export const selectHasPendingQueriesWithLoader = (state: RootState) =>
  state.app.pendingQueriesWithLoader > 0;
