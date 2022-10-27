import { createSlice } from '@reduxjs/toolkit';

import { persistor } from '~/app';
import { match401ApiResponse } from '~/app/store/actionMatchers';
import { startAppListening } from '~/app/store/middleware';
import { apiPaths, apiUrl } from '~/common/consts';
import { Me, RootState } from '~/common/types';
import { meApi } from '~/features/me/meApi';

export type MeState = {
  isSignedIn: boolean;
  user?: Me;
};

const initialState: MeState = {
  isSignedIn: false,
  user: undefined,
};

export const meSlice = createSlice({
  name: 'me',
  initialState,
  reducers: {
    signedIn: (state) => {
      state.isSignedIn = true;
    },
    signedOut: () => {},
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

// Actions
export const { signedIn, signedOut } = meSlice.actions;

// Selectors
export const selectMe = (state: RootState) => state.me.user;

// Listeners
// on sign in - fetch user
startAppListening({
  predicate: (_, currentState, previousState) => {
    return currentState.me.isSignedIn && !previousState.me.isSignedIn;
  },
  effect: (_, { dispatch }) => {
    dispatch(meApi.endpoints.getMe.initiate(undefined, { subscribe: false }));
  },
});
// on signedOut - purge localStorage state and redirect to /logout
startAppListening({
  actionCreator: signedOut,
  effect: async () => {
    await persistor.purge();
    window.location.href = apiUrl + apiPaths.logout;
  },
});
