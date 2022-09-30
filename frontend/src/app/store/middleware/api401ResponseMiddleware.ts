import { Middleware } from '@reduxjs/toolkit';

import { RootState } from '~/common/types';
import { api401Received } from '~/features/me';

export const api401ResponseMiddleware: Middleware<{}, RootState> =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (action.payload?.status === 401) {
      dispatch(api401Received());
    }
    return next(action);
  };
