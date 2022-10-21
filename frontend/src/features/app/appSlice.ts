import { ColorScheme } from '@react-types/provider';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  matchCompletedQueryWithLoader,
  matchPendingQueryWithLoader,
} from '~/app/store/actionMatchers';
import { defaultLanguage, languages } from '~/common/consts';
import { Language, RootState, ToolbarPosition } from '~/common/types';

export type AppState = {
  pendingQueriesWithLoader: number;
  language?: Language;
  colorScheme?: ColorScheme;
  toolbarPosition?: ToolbarPosition;
  browserLocale: string;
};

const initialState: AppState = {
  pendingQueriesWithLoader: 0,
  language: undefined,
  colorScheme: undefined,
  browserLocale: window.navigator.language,
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    languageChanged: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    colorSchemeChanged: (state, action: PayloadAction<ColorScheme | undefined>) => {
      state.colorScheme = action.payload;
    },
    toolbarPositionChanged: (state, action: PayloadAction<ToolbarPosition>) => {
      state.toolbarPosition = action.payload;
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

// Action creators
export const {
  languageChanged,
  browserLocaleChanged,
  colorSchemeChanged,
  toolbarPositionChanged,
} = slice.actions;

// Selectors
export const selectHasPendingQueriesWithLoader = (state: RootState) =>
  state.app.pendingQueriesWithLoader > 0;

export const selectLanguage = (state: RootState): Language => {
  if (state.app.language) {
    return state.app.language;
  }
  const browserLanguage = state.app.browserLocale.split('-')[0] as Language;
  return languages.includes(browserLanguage) ? browserLanguage : defaultLanguage;
};

export const selectColorScheme = (state: RootState) => state.app.colorScheme;

export const selectToolbarPosition = (state: RootState): ToolbarPosition =>
  state.app.toolbarPosition || 'top';
