import { createSlice } from '@reduxjs/toolkit';

import { startAppListening } from '~/app/store/middleware';
import { apiPaths, apiUrl } from '~/common/consts';
import { Me, RootState } from '~/common/types';
import {
  appLoginDialogDismissed,
  getMe,
  loginFlow,
  loginWithProvider,
} from '~/features/me';

// Slice

export type MeState = {
  isLoggedIn: boolean;
  isAppLoginDialogOpen: boolean;
  user?: Me;
  isFetchingUser: boolean;
};

const initialState: MeState = {
  isLoggedIn: false,
  isAppLoginDialogOpen: false,
  user: undefined,
  isFetchingUser: false,
};

export const meSlice = createSlice({
  name: 'me',
  initialState,
  reducers: {
    loggedOut() {},
  },
  extraReducers(builder) {
    builder.addCase(loginWithProvider.fulfilled, (state) => {
      state.isLoggedIn = true;
    });
    builder.addCase(loginFlow.pending, (state) => {
      state.isAppLoginDialogOpen = true;
    });
    builder.addCase(loginFlow.fulfilled, (state) => {
      state.isAppLoginDialogOpen = false;
    });
    builder.addCase(appLoginDialogDismissed, (state) => {
      state.isAppLoginDialogOpen = false;
    });
    builder.addMatcher(getMe.matchPending, (state) => {
      state.isFetchingUser = true;
    });
    builder.addMatcher(getMe.matchFulfilled, (state, { payload }) => {
      state.user = payload;
      state.isFetchingUser = false;
    });
    builder.addMatcher(getMe.matchRejected, (state) => {
      state.isFetchingUser = false;
    });
  },
});

export const { loggedOut } = meSlice.actions;

// Selectors

export const selectIsLoggedIn = (state: RootState) => state.me.isLoggedIn;
export const selectMe = (state: RootState) => state.me.user;
export const selectIsLoadingMe = (state: RootState) => state.me.isFetchingUser;

export const selectIsAppLoginDialogOpen = (state: RootState) =>
  state.me.isAppLoginDialogOpen;

// Listeners

startAppListening({
  predicate(action, currentState, prevState) {
    const isLoggedIn = selectIsLoggedIn(currentState);
    const wasLoggedIn = selectIsLoggedIn(prevState);
    return isLoggedIn && !wasLoggedIn;
  },
  effect(action, { dispatch }) {
    dispatch(getMe.initiate());
  },
});

startAppListening({
  actionCreator: loggedOut,
  effect() {
    localStorage.removeItem(`persist:${meSlice.name}`);
    window.location.href = apiUrl + apiPaths.logout;
  },
});
