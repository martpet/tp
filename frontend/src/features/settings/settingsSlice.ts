import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '~/common/types';
import { SettingsTabKey } from '~/features/settings/types';

export type State = {
  activeTab: SettingsTabKey;
};

const initialState: State = {
  activeTab: 'language',
};

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    tabChanged: (state, action: PayloadAction<SettingsTabKey>) => {
      state.activeTab = action.payload;
    },
  },
});

export { slice as settingsSlice };

export const { tabChanged } = slice.actions;

export const selectActiveTab = (state: RootState) => state.settings.activeTab;
