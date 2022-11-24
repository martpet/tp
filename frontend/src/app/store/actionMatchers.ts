import { AnyAction } from '@reduxjs/toolkit';

import { apiEndpointsWithAppLoader } from '~/common/consts';

export const matchPendingQueryWithAppLoader = (action: AnyAction) =>
  apiEndpointsWithAppLoader.some((endpoint) => endpoint.matchPending(action));

export const matchCompletedQueryWithAppLoader = (action: AnyAction) =>
  apiEndpointsWithAppLoader.some(
    (endpoint) => endpoint.matchFulfilled(action) || endpoint.matchRejected(action)
  );
