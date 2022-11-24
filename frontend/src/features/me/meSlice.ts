// [todo] rename folder to `auth` (?)

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { startAppListening } from '~/app/store/middleware';
import { apiPaths, apiUrl } from '~/common/consts';
import { Me, RootState } from '~/common/types';
import { meApi } from '~/features/me';
import { loginWithPopup } from '~/features/me/utils';

// Thunks

export const login = createAsyncThunk('loginStatus', loginWithPopup);

// Slice

export type MeState = {
  isLoggedIn: boolean;
  user?: Me;
};

const initialState: MeState = {
  isLoggedIn: false,
  user: undefined,
};

export const meSlice = createSlice({
  name: 'me',
  initialState,
  reducers: {
    loggedOut() {},
  },
  extraReducers(builder) {
    builder.addCase(login.fulfilled, (state) => {
      state.isLoggedIn = true;
    });
    builder.addMatcher(meApi.endpoints.getMe.matchFulfilled, (state, { payload }) => {
      state.user = payload;
    });
  },
});

export const { loggedOut } = meSlice.actions;

// Listeners

startAppListening({
  predicate(_, currentState, previousState) {
    return currentState.me.isLoggedIn && !previousState.me.isLoggedIn;
    // "actionCreator: login.fulfilled" won't work for rehydrated state from persistor
  },
  effect(_, listenerApi) {
    listenerApi.dispatch(meApi.endpoints.getMe.initiate());
  },
});

startAppListening({
  actionCreator: loggedOut,
  effect() {
    localStorage.removeItem(`persist:${meSlice.name}`);
    window.location.href = apiUrl + apiPaths.logout;
  },
});

// Selectors

export const selectMe = (state: RootState) => state.me.user;

export const selectIsLoadingMe = (state: RootState) =>
  !state.me.user && state.me.isLoggedIn;
