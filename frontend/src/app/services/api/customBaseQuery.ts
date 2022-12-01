import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';

import { refreshTokenExpiredErrorMessage } from '~/common/consts';
import { ApiErrorResponseBody, RootState } from '~/common/types';
import { isPublicEndpoint } from '~/common/utils';
import {
  loggedOut,
  loginFlow,
  loginWithProvider,
  selectIsLoggedIn,
  selectMe,
} from '~/features/me';

/*
 * If request to public endpoint and user not logged in - lock requests, await login.
 * If 401 response, but refresh token has not expired - dispatch `loggedOut`.
 * If refresh token expired - lock requests, re-login, retry failed request.
 */

export function customBaseQuery(
  ...fetchBaseQueryArgs: Parameters<typeof fetchBaseQuery>
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> {
  const baseQuery = fetchBaseQuery(...fetchBaseQueryArgs);
  const mutex = new Mutex();

  return async (args, baseQueryApi, extraOptions) => {
    await mutex.waitForUnlock();

    const { dispatch, abort, getState } = baseQueryApi;
    const isLoggedIn = selectIsLoggedIn(getState() as RootState);

    if (matchPrivateEndpoint(args) && !isLoggedIn) {
      const release = await mutex.acquire();
      try {
        await dispatch(loginFlow()).unwrap();
      } catch (err) {
        abort(`Login failed: ${(err as Error).message}`);
      } finally {
        release();
      }
    }

    let result = await baseQuery(args, baseQueryApi, extraOptions);
    const isRefreshTokenError = matchRefreshTokenExpiredError(result.error);

    if (isRefreshTokenError || match401Error(result.error)) {
      const user = selectMe(getState() as RootState);
      if (mutex.isLocked()) {
        await mutex.waitForUnlock();
        result = await baseQuery(args, baseQueryApi, extraOptions);
      } else if (isRefreshTokenError && user) {
        const release = await mutex.acquire();
        try {
          await dispatch(loginWithProvider(user.providerName)).unwrap();
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
}

function matchPrivateEndpoint(args: string | FetchArgs) {
  const path = typeof args === 'string' ? args : args.url;
  let method = 'GET';
  if (typeof args !== 'string' && args.method) method = args.method;
  return !isPublicEndpoint({ path, method });
}

function match401Error(error?: FetchBaseQueryError): error is FetchBaseQueryError {
  return error?.status === 401;
}

function matchRefreshTokenExpiredError(error?: FetchBaseQueryError) {
  try {
    const body = JSON.parse(error?.data as string) as ApiErrorResponseBody;
    return body.error.error?.includes(refreshTokenExpiredErrorMessage);
  } catch (e) {
    return false;
  }
}
