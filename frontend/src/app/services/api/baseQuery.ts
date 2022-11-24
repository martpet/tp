import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';

import { refreshTokenExpiredErrorMessage } from '~/common/consts';
import { ApiErrorResponseBody, RootState } from '~/common/types';
import { loggedOut, selectMe } from '~/features';
import { loginWithPopup } from '~/features/me/utils';

/*
 * When refresh token expires open login popup, wait for for login success, retry awaited requests.
 * When 401 error, but refresh token not expired, dispatch `loggedOut`.
 *
 * https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-re-authorization-by-extending-fetchbasequery
 * https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#preventing-multiple-unauthorized-errors
 */

const mutex = new Mutex();

const checkIs401 = (error?: FetchBaseQueryError): error is FetchBaseQueryError =>
  error?.status === 401;

const checkIsExpiredRefreshTokenError = (error?: FetchBaseQueryError) => {
  try {
    return (
      JSON.parse(error?.data as string) as ApiErrorResponseBody
    ).error.error?.includes(refreshTokenExpiredErrorMessage);
  } catch (e) {
    return false;
  }
};

export const createBaseQuery = (
  ...fetchBaseQueryArgs: Parameters<typeof fetchBaseQuery>
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  const baseQuery = fetchBaseQuery(...fetchBaseQueryArgs);

  return async (args, baseQueryApi, extraOptions) => {
    await mutex.waitForUnlock();

    let result = await baseQuery(args, baseQueryApi, extraOptions);
    const is401 = checkIs401(result.error);
    const isExpiredRefreshTokenError = checkIsExpiredRefreshTokenError(result.error);

    if (is401 || isExpiredRefreshTokenError) {
      const { dispatch, getState } = baseQueryApi;

      if (mutex.isLocked()) {
        await mutex.waitForUnlock();
        result = await baseQuery(args, baseQueryApi, extraOptions);
      } else {
        const release = await mutex.acquire();
        const state = getState() as RootState;
        const user = selectMe(state);

        try {
          if (isExpiredRefreshTokenError && user) {
            await dispatch(loginWithPopup(user.providerName));
            result = await baseQuery(args, baseQueryApi, extraOptions);
          } else {
            dispatch(loggedOut());
          }
        } catch (e) {
          dispatch(loggedOut());
        } finally {
          release();
        }
      }
    }

    return result;
  };
};
