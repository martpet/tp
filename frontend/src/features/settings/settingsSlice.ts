import { createAction, createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { RequireAtLeastOne } from 'type-fest';

import { startAppListening } from '~/app/store/middleware';
import { defaultLanguage, languages } from '~/common/consts';
import { Language, RootState, ToolbarPosition, UserSettings } from '~/common/types';
import { getMe, selectIsLoggedIn } from '~/features/me';
import { getSettingsToSync, SettingsTabKey, updateSettings } from '~/features/settings';

// Actions

export const settingsChanged =
  createAction<RequireAtLeastOne<UserSettings>>('settings/changed');

export const gotNewSettingsFromRemote = createAction<RequireAtLeastOne<UserSettings>>(
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
      isAnyOf(settingsChanged, gotNewSettingsFromRemote),
      (state, action) => {
        Object.assign(state.userSettings, action.payload);
      }
    );
  },
});

export const { activeTabChanged } = settingsSlice.actions;

// Selectors

const selectSettings = (state: RootState) => state.settings.userSettings;

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
  actionCreator: settingsChanged,
  effect({ payload }, { dispatch, getState }) {
    const isLoggedIn = selectIsLoggedIn(getState());
    if (isLoggedIn) {
      dispatch(updateSettings.initiate(payload));
    }
  },
});

startAppListening({
  matcher: getMe.matchFulfilled,
  effect({ payload }, { dispatch, getState }) {
    const { localPatch, remotePatch } = getSettingsToSync({
      localSettings: selectSettings(getState()),
      remoteSettings: payload.settings,
    });
    if (localPatch) {
      dispatch(gotNewSettingsFromRemote(localPatch));
    }
    if (remotePatch) {
      dispatch(updateSettings.initiate(remotePatch));
    }
  },
});
