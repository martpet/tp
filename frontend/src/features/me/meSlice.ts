import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { match401ApiResponse } from '~/app/store/actionMatchers';
import { startAppListening } from '~/app/store/middleware';
import { apiPaths, apiUrl } from '~/common/consts';
import { RootState } from '~/common/types';
import { loginWithPopup } from '~/features/me/utils';

// Selectors

export const selectIsSignedIn = (state: RootState) => state.me.isSignedIn;

// Thunks

export const login = createAsyncThunk('loginStatus', loginWithPopup);

// Slice

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
    signedOut: () => {},
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state) => {
      state.isSignedIn = true;
    });
    builder.addMatcher(match401ApiResponse, () => {
      return initialState;
    });
  },
});

export const { signedOut } = meSlice.actions;

// Listeners

startAppListening({
  actionCreator: signedOut,
  effect: async () => {
    localStorage.removeItem(`persist:${meSlice.name}`);
    window.location.href = apiUrl + apiPaths.logout;
  },
});
