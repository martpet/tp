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
  login,
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

  return async (args, api, extraOptions) => {
    await mutex.waitForUnlock();

    let state = api.getState() as RootState;
    const isLoggedIn = selectIsLoggedIn(state);

    if (matchPrivateEndpoint(args) && !isLoggedIn) {
      const release = await mutex.acquire();
      try {
        await api.dispatch(login()).unwrap();
      } catch (err) {
        api.abort(`Login failed: ${(err as Error).message}`);
      } finally {
        release();
      }
    }

    let result = await baseQuery(args, api, extraOptions);
    const isRefreshTokenError = matchRefreshTokenExpiredError(result.error);

    if (isRefreshTokenError || match401Error(result.error)) {
      state = api.getState() as RootState;
      const user = selectMe(state);
      if (mutex.isLocked()) {
        await mutex.waitForUnlock();
        result = await baseQuery(args, api, extraOptions);
      } else if (isRefreshTokenError && user) {
        const release = await mutex.acquire();
        try {
          await api.dispatch(loginWithProvider(user.providerName)).unwrap();
          result = await baseQuery(args, api, extraOptions);
        } catch (e) {
          api.dispatch(loggedOut());
        } finally {
          release();
        }
      } else {
        api.dispatch(loggedOut());
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
