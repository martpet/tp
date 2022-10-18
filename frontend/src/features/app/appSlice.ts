import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  matchCompletedQueryWithLoader,
  matchPendingQueryWithLoader,
} from '~/app/store/actionMatchers';
import { defaultLanguage, languages } from '~/common/consts';
import { Language, RootState } from '~/common/types';

export type AppState = {
  pendingQueriesWithLoader: number;
  language?: Language;
  browserLocale: string;
};

const initialState: AppState = {
  pendingQueriesWithLoader: 0,
  language: undefined,
  browserLocale: window.navigator.language,
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    languageChanged: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
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

export { slice as appSlice };

export const { languageChanged, browserLocaleChanged } = slice.actions;

export const selectHasPendingQueriesWithLoader = (state: RootState) =>
  state.app.pendingQueriesWithLoader > 0;

export const selectLanguage = (state: RootState): Language => {
  if (state.app.language) {
    return state.app.language;
  }
  const browserLanguage = state.app.browserLocale.split('-')[0] as Language;
  return languages.includes(browserLanguage) ? browserLanguage : defaultLanguage;
};
