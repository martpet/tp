import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';

import { refreshTokenExpiredErrorMessage } from '~/common/consts';
import { ApiErrorResponseBody, RootState } from '~/common/types';
import { loggedOut, loginWithProvider, selectMe } from '~/features/me';

/*
 * When refresh token expires - open login popup, wait for login success, retry awaited requests.
 * When 401, but refresh token has not expired - dispatch `loggedOut`.
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
      const { getState, dispatch } = baseQueryApi;
      const state = getState() as RootState;
      const user = selectMe(state);

      if (mutex.isLocked()) {
        await mutex.waitForUnlock();
        result = await baseQuery(args, baseQueryApi, extraOptions);
      } else if (isExpiredRefreshTokenError && user) {
        const release = await mutex.acquire();
        try {
          await dispatch(loginWithProvider(user.providerName));
          result = await baseQuery(args, baseQueryApi, extraOptions);
        } catch (e) {
          dispatch(loggedOut());
        } finally {
          release();
        }
      } else {
        dispatch(loggedOut());
      }
    }

    return result;
  };
};
