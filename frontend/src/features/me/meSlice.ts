import { createSlice } from '@reduxjs/toolkit';

import { api401Received } from '~/app/store/actions';
import { startAppListening } from '~/app/store/middleware';
import { Me, RootState } from '~/common/types';
import { meApi } from '~/features/me';

export type MeState = {
  isSignedIn: boolean;
  data?: Me;
};

const initialState: MeState = {
  isSignedIn: false,
  data: undefined,
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
  },
  extraReducers: (builder) => {
    builder.addCase(api401Received, () => {
      return initialState;
    });
    builder.addMatcher(meApi.endpoints.getMe.matchFulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

startAppListening({
  predicate: (_, currentState, previousState) => {
    return currentState.me.isSignedIn === true && previousState.me.isSignedIn === false;
  },
  effect: (_, { dispatch }) => {
    dispatch(meApi.endpoints.getMe.initiate(undefined, { subscribe: false }));
  },
});

export { slice as meSlice };

export const { signedIn, signedOut } = slice.actions;

export const selectMe = (state: RootState) => state.me.data;
