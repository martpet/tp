import { AnyAction } from '@reduxjs/toolkit';

import { apiEndpointsWithAppLoader } from '~/common/consts';

const isApiEndpoint = (action: AnyAction) => action.meta?.arg?.endpointName !== undefined;

export const matchPendingQueryWithAppLoader = (action: AnyAction) =>
  isApiEndpoint(action) &&
  apiEndpointsWithAppLoader.some((endpoint) => endpoint.matchPending(action));

export const matchCompletedQueryWithAppLoader = (action: AnyAction) =>
  isApiEndpoint(action) &&
  apiEndpointsWithAppLoader.some(
    (endpoint) => endpoint.matchFulfilled(action) || endpoint.matchRejected(action)
  );

export const match401ApiResponse = (action: AnyAction) =>
  isApiEndpoint(action) && action.payload?.status === 401;
