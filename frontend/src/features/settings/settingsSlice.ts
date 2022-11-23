import { createAction, createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { RequireAtLeastOne } from 'type-fest';

import { startAppListening } from '~/app/store/middleware';
import { defaultLanguage, languages } from '~/common/consts';
import { Language, RootState, ToolbarPosition, UserSettings } from '~/common/types';
import { meApi } from '~/features/me';
import { getSettingsToSync } from '~/features/me/utils';
import { settingsApi, SettingsTabKey } from '~/features/settings';

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

// Actions

export const settingsChanged =
  createAction<RequireAtLeastOne<UserSettings>>('settings/changed');

export const gotNewSettingsFromDb = createAction<RequireAtLeastOne<UserSettings>>(
  'settings/changedFromDb'
);

// Slice

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
      isAnyOf(settingsChanged, gotNewSettingsFromDb),
      (state, action) => {
        Object.assign(state.userSettings, action.payload);
      }
    );
  },
});

export const { activeTabChanged } = settingsSlice.actions;

// Listeners

startAppListening({
  actionCreator: settingsChanged,
  effect: (action, listenerApi) => {
    // Sync settings -> db
    const state = listenerApi.getState();
    if (state.me.isSignedIn) {
      listenerApi.dispatch(settingsApi.endpoints.updateSettings.initiate(action.payload));
    }
  },
});

startAppListening({
  matcher: meApi.endpoints.getMe.matchFulfilled,
  effect: (action, listenerApi) => {
    // Sync settings <--> db
    const state = listenerApi.getState();
    const { localPatch, remotePatch } = getSettingsToSync({
      localSettings: state.settings.userSettings,
      remoteSettings: action.payload.settings,
    });
    if (localPatch) {
      listenerApi.dispatch(gotNewSettingsFromDb(localPatch));
    }
    if (remotePatch) {
      listenerApi.dispatch(settingsApi.endpoints.updateSettings.initiate(remotePatch));
    }
  },
});
