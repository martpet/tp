import { AnyAction } from '@reduxjs/toolkit';

const isApiEndpoint = (action: AnyAction) => action.meta?.arg?.endpointName !== undefined;

export const match401ApiResponse = (action: AnyAction) =>
  isApiEndpoint(action) && action.payload?.status === 401;
