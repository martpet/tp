import { createAction } from '@reduxjs/toolkit';

export const fileRemovalTransitionEnded = createAction<string>(
  'upload/fileRemovalTransitionEnded'
);
