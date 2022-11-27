import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '~/common/types';
import { selectUploadableFiles, uploadApi } from '~/features/upload';

export const upload = createAsyncThunk(
  'uploadStatus',
  async (arg, { getState, dispatch }) => {
    const state = getState() as RootState;
    const files = selectUploadableFiles(state);
    await dispatch(uploadApi.endpoints.generateUploadUrls.initiate(files)).unwrap();
    return 'foo';
    // [todo] send  100-continue HTTP status code before upoading - maybe file size is too big or another problem
  }
);
