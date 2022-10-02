import { AnyAction } from '@reduxjs/toolkit';

import { endpointsWithAppLoader } from '~/common/consts';

const isApiEndpoint = (action: AnyAction) => action.meta?.arg?.endpointName !== undefined;

export const matchActiveQueryWithAppLoader = (action: AnyAction) =>
  isApiEndpoint(action) &&
  endpointsWithAppLoader.some((endpoint) => endpoint.matchPending(action));

export const matchCompletedQueryWithAppLoader = (action: AnyAction) =>
  isApiEndpoint(action) &&
  endpointsWithAppLoader.some(
    (endpoint) => endpoint.matchFulfilled(action) || endpoint.matchRejected(action)
  );

export const match401ApiResponse = (action: AnyAction) =>
  isApiEndpoint(action) && action.payload?.status === 401;
