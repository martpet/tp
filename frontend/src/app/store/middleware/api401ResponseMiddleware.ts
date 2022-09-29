import { Middleware } from '@reduxjs/toolkit';

import { RootState } from '~/common/types';
import { logout } from '~/features/me';

export const api401ResponseMiddleware: Middleware<{}, RootState> =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (action.payload?.status === 401) {
      dispatch(logout());
    }
    return next(action);
  };
