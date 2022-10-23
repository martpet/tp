import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { defaultLanguage, languages } from '~/common/consts';
import { ColorScheme, Language, RootState, ToolbarPosition } from '~/common/types';

export type SettingsState = {
  language?: Language;
  colorScheme?: ColorScheme;
  toolbarPosition?: ToolbarPosition;
};

const initialState: SettingsState = {
  language: undefined,
  colorScheme: undefined,
  toolbarPosition: undefined,
};

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    languageChanged: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    colorSchemeChanged: (state, action: PayloadAction<ColorScheme>) => {
      state.colorScheme = action.payload;
    },
    toolbarPositionChanged: (state, action: PayloadAction<ToolbarPosition>) => {
      state.toolbarPosition = action.payload;
    },
  },
});

export { slice as settingsSlice };

export const { languageChanged, colorSchemeChanged, toolbarPositionChanged } =
  slice.actions;

export const selectLanguage = (state: RootState): Language => {
  if (state.settings.language) {
    return state.settings.language;
  }
  const browserLanguage = state.app.browserLocale.split('-')[0] as Language;
  return languages.includes(browserLanguage) ? browserLanguage : defaultLanguage;
};

export const selectColorScheme = (state: RootState) => state.settings.colorScheme || 'os';

export const selectToolbarPosition = (state: RootState): ToolbarPosition =>
  state.settings.toolbarPosition || 'top';
