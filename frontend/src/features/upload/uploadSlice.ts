import { createSelector, createSlice } from '@reduxjs/toolkit';

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
      state.filesMeta = state.filesMeta.concat(action.payload.filesMeta);
      state.duplicateFilesKeys = action.payload.duplicateFilesKeys;
    });
  },
});

export const selectFiles = createSelector(
  (state: RootState) => state.upload.filesMeta,
  (state: RootState) => state.upload.duplicateFilesKeys,
  (filesMeta, duplicateFilesKeys) => {
    const files = filesMeta.map((meta) => ({
      blob: window.uploadBlobs[meta.key],
      ...meta,
    }));
    const duplicateFiles = files.filter(({ key }) => duplicateFilesKeys.includes(key));
    return { files, duplicateFiles };
  }
);
