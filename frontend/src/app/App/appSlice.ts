import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  matchCompletedQueryWithLoader,
  matchPendingQueryWithLoader,
} from '~/app/store/actionMatchers';
import { defaultLanguage } from '~/common/consts';
import { AppLanguage, RootState } from '~/common/types';

export type AppState = {
  language: AppLanguage;
  pendingQueriesWithLoader: number;
};

const initialState: AppState = {
  language: defaultLanguage,
  pendingQueriesWithLoader: 0,
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    languageChanged: (state, action: PayloadAction<AppLanguage>) => {
      state.language = action.payload;
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

export const { languageChanged } = slice.actions;

export const selectAppLanguage = (state: RootState) => state.app.language;

export const selectHasPendingQueriesWithLoader = (state: RootState) =>
  state.app.pendingQueriesWithLoader > 0;
