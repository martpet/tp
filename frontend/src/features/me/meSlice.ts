import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { match401ApiResponse } from '~/app/store/actionMatchers';
import { startAppListening } from '~/app/store/middleware';
import { languages } from '~/common/consts';
import { Language, Me, RootState } from '~/common/types';
import { meApi } from '~/features/me';

export type MeState = {
  isSignedIn: boolean;
  user?: Me;
  language?: Language;
};

const initialState: MeState = {
  isSignedIn: false,
  user: undefined,
  language: undefined,
};

const slice = createSlice({
  name: 'me',
  initialState,
  reducers: {
    signedIn: (state) => {
      state.isSignedIn = true;
    },
    languageChanged: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(meApi.endpoints.getMe.matchFulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addMatcher(match401ApiResponse, () => {
      return initialState;
    });
  },
});

startAppListening({
  predicate: (_, currentState, previousState) => {
    return currentState.me.isSignedIn && !previousState.me.isSignedIn;
  },
  effect: (_, { dispatch }) => {
    dispatch(meApi.endpoints.getMe.initiate(undefined, { subscribe: false }));
  },
});

export { slice as meSlice };

export const { signedIn, languageChanged } = slice.actions;

export const selectMe = (state: RootState) => state.me.user;

export const selectLanguage = (state: RootState): Language => {
  if (state.me.language) {
    return state.me.language;
  }
  return (
    languages.find((language) => language === window.navigator.language.split('-')[0]) ||
    'en'
  );
};
