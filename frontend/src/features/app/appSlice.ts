import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  matchCompletedQueryWithAppLoader,
  matchPendingQueryWithAppLoader,
} from '~/app/store/actionMatchers';
import { RootState } from '~/common/types';

// Slice
export type AppState = {
  pendingQueriesWithLoader: number;
  browserLocale: string;
  isUploadDialogOpen: boolean;
};

const initialState: AppState = {
  pendingQueriesWithLoader: 0,
  browserLocale: window.navigator.language,
  isUploadDialogOpen: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    browserLocaleChanged(state) {
      state.browserLocale = window.navigator.language;
    },
    uploadDialogToggled(state, { payload }: PayloadAction<boolean>) {
      state.isUploadDialogOpen = payload;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(matchPendingQueryWithAppLoader, (state) => {
      state.pendingQueriesWithLoader++;
    });
    builder.addMatcher(matchCompletedQueryWithAppLoader, (state) => {
      state.pendingQueriesWithLoader--;
    });
  },
});

export const { browserLocaleChanged, uploadDialogToggled } = appSlice.actions;

// Selectors
export const selectHasPendingQueriesWithLoader = (state: RootState) =>
  state.app.pendingQueriesWithLoader > 0;

export const selectUploadDialogOpened = (state: RootState) =>
  state.app.isUploadDialogOpen;
