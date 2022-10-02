import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  matchActiveQueryWithAppLoader,
  matchCompletedQueryWithAppLoader,
} from '~/app/store/actionMatchers';
import { initialLanguage } from '~/common/consts';
import { AppLanguage, RootState } from '~/common/types';

export type AppState = {
  language: AppLanguage;
  activeQueriesWithAppLoader: number;
};

const initialState: AppState = {
  language: initialLanguage,
  activeQueriesWithAppLoader: 0,
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
    builder.addMatcher(matchActiveQueryWithAppLoader, (state) => {
      state.activeQueriesWithAppLoader++;
    });
    builder.addMatcher(matchCompletedQueryWithAppLoader, (state) => {
      state.activeQueriesWithAppLoader--;
    });
  },
});

export { slice as appSlice };

export const { languageChanged } = slice.actions;

export const selectAppLanguage = (state: RootState) => state.app.language;

export const selectHasActiveAppQueries = (state: RootState) =>
  state.app.activeQueriesWithAppLoader > 0;
