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
 * If refresh token expired error - open login popup and on successful login retry the awaited request(s).
 * If 401 error and refresh token *not* expired: dispatch `loggedOut` action.
 *
 * https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-re-authorization-by-extending-fetchbasequery
 * https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#preventing-multiple-unauthorized-errors
 */

const checkIs401 = (error?: FetchBaseQueryError): error is FetchBaseQueryError =>
  error?.status === 401;

const checkIsExpiredRefreshToken = (error?: FetchBaseQueryError) => {
  try {
    return (
      JSON.parse(error?.data as string) as ApiErrorResponseBody
    ).error.error?.includes(refreshTokenExpiredErrorMessage);
  } catch (e) {
    return false;
  }
};

export const baseQueryWithReauth = (
  ...fetchBaseQueryArgs: Parameters<typeof fetchBaseQuery>
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  const baseQuery = fetchBaseQuery(...fetchBaseQueryArgs);
  const mutex = new Mutex();

  return async (args, baseQueryApi, extraOptions) => {
    await mutex.waitForUnlock();
    let result = await baseQuery(args, baseQueryApi, extraOptions);

    const is401 = checkIs401(result.error);
    const isExpiredRefreshToken = checkIsExpiredRefreshToken(result.error);

    if (is401 || isExpiredRefreshToken) {
      const { dispatch, getState } = baseQueryApi;

      if (mutex.isLocked()) {
        await mutex.waitForUnlock();
        result = await baseQuery(args, baseQueryApi, extraOptions);
      } else {
        const release = await mutex.acquire();
        const state = getState() as RootState;
        const user = selectMe(state);

        try {
          if (isExpiredRefreshToken && user) {
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
