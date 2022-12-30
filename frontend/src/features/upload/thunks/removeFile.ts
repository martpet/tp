import { createAsyncThunk } from '@reduxjs/toolkit';

import { addAppListener } from '~/app/store/middleware';

import { fileRemovalTransitionEnded } from '../uploadActions';

export const removeFile = createAsyncThunk<string, string>(
  'upload/fileRemovalStatus',
  (fileId, { dispatch }) =>
    new Promise((resolve) => {
      dispatch(
        addAppListener({
          actionCreator: fileRemovalTransitionEnded,
          effect(action, { unsubscribe }) {
            if (action.payload === fileId) {
              resolve(fileId);
              unsubscribe();
            }
          },
        })
      );
    })
);
