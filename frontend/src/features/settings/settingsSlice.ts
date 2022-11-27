import { createAction, createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { RequireAtLeastOne } from 'type-fest';

import { startAppListening } from '~/app/store/middleware';
import { defaultLanguage, languages } from '~/common/consts';
import { Language, RootState, ToolbarPosition, UserSettings } from '~/common/types';
import { meApi } from '~/features/me';
import { getSettingsToSync, settingsApi, SettingsTabKey } from '~/features/settings';

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
    activeTabChanged(state, action: PayloadAction<SettingsTabKey>) {
      state.activeTab = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      isAnyOf(settingsChanged, gotNewSettingsFromDb),
      (state, action) => {
        Object.assign(state.userSettings, action.payload);
      }
    );
  },
});

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

startAppListening({
  // Sync settings -> db
  actionCreator: settingsChanged,
  effect(action, listenerApi) {
    const state = listenerApi.getState();
    if (state.me.isLoggedIn) {
      listenerApi.dispatch(settingsApi.endpoints.updateSettings.initiate(action.payload));
    }
  },
});

startAppListening({
  // Sync settings <--> db
  matcher: meApi.endpoints.getMe.matchFulfilled,
  effect(action, listenerApi) {
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
