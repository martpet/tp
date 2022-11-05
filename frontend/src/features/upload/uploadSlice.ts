import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '~/common/types';
import { addFiles } from '~/features/upload/thunks';
import { FileMeta } from '~/features/upload/types';

type UploadState = {
  filesMeta: FileMeta[];
  duplicateFilesKeys: string[];
};

const initialState: UploadState = {
  filesMeta: [],
  duplicateFilesKeys: [],
};

export const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addFiles.fulfilled, (state, action) => {
      if (action.payload.filesMeta.length) {
        state.filesMeta = state.filesMeta.concat(action.payload.filesMeta);
      }
      if (action.payload.duplicateFilesKeys.length) {
        state.duplicateFilesKeys = action.payload.duplicateFilesKeys;
      }
    });
  },
});

export const selectFiles = (state: RootState) => state.upload.filesMeta;
