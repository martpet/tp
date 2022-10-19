import { createSlice } from '@reduxjs/toolkit';

import { match401ApiResponse } from '~/app/store/actionMatchers';
import { startAppListening } from '~/app/store/middleware';
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

const slice = createSlice({
  name: 'me',
  initialState,
  reducers: {
    signedIn: (state) => {
      state.isSignedIn = true;
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

export const { signedIn } = slice.actions;

export const selectMe = (state: RootState) => state.me.user;
