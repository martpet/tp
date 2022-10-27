import { createAction, createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { RequireAtLeastOne } from 'type-fest';

import { startAppListening } from '~/app/store/middleware';
import { defaultLanguage, languages } from '~/common/consts';
import { Language, RootState, ToolbarPosition, UserSettings } from '~/common/types';
import { meApi } from '~/features/me';
import { settingsApi, SettingsTabKey } from '~/features/settings';

import { getSettingsSyncPatches } from './getSettingsSyncPatches';

export type SettingsState = {
  userSettings: UserSettings;
  activeTab: SettingsTabKey;
};

const initialState: SettingsState = {
  userSettings: {
    language: undefined,
    colorScheme: undefined,
    toolbarPosition: undefined,
  },
  activeTab: 'language',
};

// Custom actions
export const settingsChanged =
  createAction<RequireAtLeastOne<UserSettings>>('settings/changed');

export const settingsFromDbChanged = createAction<RequireAtLeastOne<UserSettings>>(
  'settings/changedFromDb'
);

// Slice
export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    activeTabChanged: (state, action: PayloadAction<SettingsTabKey>) => {
      state.activeTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(settingsChanged, settingsFromDbChanged),
      (state, action) => {
        Object.assign(state.userSettings, action.payload);
      }
    );
  },
});

// Actions
export const { activeTabChanged } = settingsSlice.actions;

// Selectors
export const selectActiveTab = (state: RootState) => state.settings.activeTab;

export const selectLanguage = (state: RootState): Language => {
  const { language } = state.settings.userSettings;
  if (language) return language;
  const browserLanguage = state.app.browserLocale.split('-')[0] as Language;
  return languages.includes(browserLanguage) ? browserLanguage : defaultLanguage;
};

export const selectColorScheme = (state: RootState) =>
  state.settings.userSettings.colorScheme || 'os';

export const selectToolbarPosition = (state: RootState): ToolbarPosition =>
  state.settings.userSettings.toolbarPosition || 'top';

// Listeners
// on settingsChanged - save to db
startAppListening({
  actionCreator: settingsChanged,
  effect: (action, listenerApi) => {
    const { user } = listenerApi.getState().me;
    if (user) {
      listenerApi.dispatch(settingsApi.endpoints.updateSettings.initiate(action.payload));
    }
  },
});
// on login - sync local with remote settings
startAppListening({
  matcher: meApi.endpoints.getMe.matchFulfilled,
  effect: (_, listenerApi) => {
    const { localPatch, remotePatch } = getSettingsSyncPatches(listenerApi.getState());
    if (localPatch) {
      listenerApi.dispatch(settingsFromDbChanged(localPatch));
    }
    if (remotePatch) {
      listenerApi.dispatch(settingsApi.endpoints.updateSettings.initiate(remotePatch));
    }
  },
});
