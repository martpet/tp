import { ColorScheme } from '@react-types/provider';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { defaultLanguage, languages } from '~/common/consts';
import { Language, RootState, ToolbarPosition } from '~/common/types';
import { SettingsTabKey } from '~/features/settings/types';

export type SettingsState = {
  activeTab: SettingsTabKey;
  language?: Language;
  colorScheme?: ColorScheme;
  toolbarPosition?: ToolbarPosition;
};

const initialState: SettingsState = {
  activeTab: 'language',
  language: undefined,
  colorScheme: undefined,
  toolbarPosition: undefined,
};

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    tabChanged: (state, action: PayloadAction<SettingsTabKey>) => {
      state.activeTab = action.payload;
    },
    languageChanged: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    colorSchemeChanged: (state, action: PayloadAction<ColorScheme | undefined>) => {
      state.colorScheme = action.payload;
    },
    toolbarPositionChanged: (state, action: PayloadAction<ToolbarPosition>) => {
      state.toolbarPosition = action.payload;
    },
  },
});

export { slice as settingsSlice };

export const { tabChanged, languageChanged, colorSchemeChanged, toolbarPositionChanged } =
  slice.actions;

export const selectActiveTab = (state: RootState) => state.settings.activeTab;

export const selectLanguage = (state: RootState): Language => {
  if (state.settings.language) {
    return state.settings.language;
  }
  const browserLanguage = state.app.browserLocale.split('-')[0] as Language;
  return languages.includes(browserLanguage) ? browserLanguage : defaultLanguage;
};

export const selectColorScheme = (state: RootState) => state.settings.colorScheme;

export const selectToolbarPosition = (state: RootState): ToolbarPosition =>
  state.settings.toolbarPosition || 'top';
