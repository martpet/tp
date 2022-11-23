import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { match401ApiResponse } from '~/app/store/actionMatchers';
import { startAppListening } from '~/app/store/middleware';
import { apiPaths, apiUrl } from '~/common/consts';
import { RootState } from '~/common/types';
import { loginWithPopup } from '~/features/me/utils';

// Thunks

export const login = createAsyncThunk('loginStatus', loginWithPopup);

// Slice

export type MeState = {
  isLogedIn: boolean;
};

const initialState: MeState = {
  isLogedIn: false,
};

export const meSlice = createSlice({
  name: 'me',
  initialState,
  reducers: {
    loggedOut: () => {},
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state) => {
      state.isLogedIn = true;
    });
    builder.addMatcher(match401ApiResponse, () => {
      return initialState;
    });
  },
});

export const { loggedOut } = meSlice.actions;

// Listeners

startAppListening({
  actionCreator: loggedOut,
  effect: async () => {
    localStorage.removeItem(`persist:${meSlice.name}`);
    window.location.href = apiUrl + apiPaths.logout;
  },
});

// Selectors

export const selectIsSignedIn = (state: RootState) => state.me.isLogedIn;
