import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { initialLanguage } from '~/common/consts';
import { AppLanguage, RootState } from '~/common/types';

export type AppState = {
  language: AppLanguage;
};

const initialState: AppState = {
  language: initialLanguage,
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    languageChanged: (state, action: PayloadAction<AppLanguage>) => {
      state.language = action.payload;
    },
  },
});

export { slice as appSlice };

export const { languageChanged } = slice.actions;

export const selectAppLanguage = (state: RootState) => state.app.language;
