import { AnyAction } from '@reduxjs/toolkit';

import { endpointsWithLoader } from '~/common/consts';

const isApiEndpoint = (action: AnyAction) => action.meta?.arg?.endpointName !== undefined;

export const matchPendingQueryWithLoader = (action: AnyAction) =>
  isApiEndpoint(action) &&
  endpointsWithLoader.some((endpoint) => endpoint.matchPending(action));

export const matchCompletedQueryWithLoader = (action: AnyAction) =>
  isApiEndpoint(action) &&
  endpointsWithLoader.some(
    (endpoint) => endpoint.matchFulfilled(action) || endpoint.matchRejected(action)
  );

export const match401ApiResponse = (action: AnyAction) =>
  isApiEndpoint(action) && action.payload?.status === 401;
