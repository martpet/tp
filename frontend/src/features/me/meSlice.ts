import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { match401ApiResponse } from '~/app/store/actionMatchers';
import { startAppListening } from '~/app/store/middleware';
import { appLanguages } from '~/common/consts';
import { AppLanguage, Me, RootState } from '~/common/types';
import { meApi } from '~/features/me';

export type MeState = {
  isSignedIn: boolean;
  user?: Me;
  language?: AppLanguage;
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
    signedOut: () => {
      return initialState;
    },
    languageChanged: (state, action: PayloadAction<AppLanguage>) => {
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

export const { signedIn, signedOut, languageChanged } = slice.actions;

export const selectMe = (state: RootState) => state.me.user;

export const selectLanguage = (state: RootState): AppLanguage => {
  if (state.me.language) {
    return state.me.language;
  }
  return (
    appLanguages.find(
      (language) => language === window.navigator.language.split('-')[0]
    ) || 'en'
  );
};
