import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '~/common/types';
import { uploadApi } from '~/features/upload/uploadApi';
import { selectUploadableFiles } from '~/features/upload/uploadSlice';

export const upload = createAsyncThunk(
  'upload/status',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const files = selectUploadableFiles(state);
    return dispatch(uploadApi.endpoints.generateUploadUrls.initiate(files));

    // use the 100-continue HTTP status code before upoading - maybe file size is too big or another problem
  }
);
