import { Middleware } from '@reduxjs/toolkit';

import { api401Received } from '~/app/store/actions';
import { RootState } from '~/common/types';

export const api401ResponseMiddleware: Middleware<{}, RootState> =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (action.payload?.status === 401) {
      dispatch(api401Received());
    }
    return next(action);
  };
