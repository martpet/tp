import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  matchCompletedQueryWithLoader,
  matchPendingQueryWithLoader,
} from '~/app/store/actionMatchers';
import { RootState } from '~/common/types';
import { SettingsTabKey } from '~/features/settings';

export type AppState = {
  pendingQueriesWithLoader: number;
  browserLocale: string;
  settingsActiveTab: SettingsTabKey;
};

const initialState: AppState = {
  pendingQueriesWithLoader: 0,
  browserLocale: window.navigator.language,
  settingsActiveTab: 'language',
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    browserLocaleChanged: (state) => {
      state.browserLocale = window.navigator.language;
    },
    settingsActiveTabChanged: (state, action: PayloadAction<SettingsTabKey>) => {
      state.settingsActiveTab = action.payload;
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

export { slice as appSlice };

export const { browserLocaleChanged, settingsActiveTabChanged } = slice.actions;

export const selectHasPendingQueriesWithLoader = (state: RootState) =>
  state.app.pendingQueriesWithLoader > 0;

export const selectSettingsActiveTab = (state: RootState) => state.app.settingsActiveTab;
