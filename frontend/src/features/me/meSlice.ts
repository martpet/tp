import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { startAppListening } from '~/app/store/middleware';
import { Me, RootState } from '~/common/types';
import { meApi } from '~/features/me';

export type MeState = {
  hasSession: boolean;
  data?: Me;
};

const initialState: MeState = {
  hasSession: false,
  data: undefined,
};

const slice = createSlice({
  name: 'me',
  initialState,
  reducers: {
    setHasSession: (state, action: PayloadAction<boolean>) => {
      state.hasSession = action.payload;
    },
    logout: (state) => {
      state.hasSession = false;
      state.data = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(meApi.endpoints.getMe.matchFulfilled, (state, { payload }) => {
      state.data = payload;
    });
  },
});

startAppListening({
  predicate: (_, currentState, previousState) => {
    return currentState.me.hasSession === true && previousState.me.hasSession === false;
  },
  effect: (_, { dispatch }) => {
    dispatch(meApi.endpoints.getMe.initiate(undefined, { subscribe: false }));
  },
});

export { slice as meSlice };

export const { setHasSession, logout } = slice.actions;

export const selectMe = (state: RootState) => state.me.data;
