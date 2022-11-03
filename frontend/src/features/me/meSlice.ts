import { createSlice } from '@reduxjs/toolkit';

import { match401ApiResponse } from '~/app/store/actionMatchers';
import { startAppListening } from '~/app/store/middleware';
import { apiPaths, apiUrl } from '~/common/consts';
import { RootState } from '~/common/types';

export type MeState = {
  isSignedIn: boolean;
};

const initialState: MeState = {
  isSignedIn: false,
};

export const meSlice = createSlice({
  name: 'me',
  initialState,
  reducers: {
    signedIn: (state) => {
      state.isSignedIn = true;
    },
    signedOut: (state) => {
      state.isSignedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(match401ApiResponse, () => {
      return initialState;
    });
  },
});

export const { signedIn, signedOut } = meSlice.actions;

startAppListening({
  actionCreator: signedOut,
  effect: async () => {
    window.location.href = apiUrl + apiPaths.logout;
  },
});

export const selectIsSignedIn = (state: RootState) => state.me.isSignedIn;
