import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '~/common/types';
import { addFiles } from '~/features/upload/thunks';
import { FileMeta, FileValidityError } from '~/features/upload/types';

type UploadState = {
  files: FileMeta[];
  duplicateAddedFiles: string[];
};

const initialState: UploadState = {
  files: [],
  duplicateAddedFiles: [],
};

export const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    fileRemoved: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter(({ key }) => key !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addFiles.fulfilled, (state, action) => {
      if (action.payload.filesMeta.length) {
        state.files = state.files.concat(action.payload.filesMeta);
      }
      state.duplicateAddedFiles = action.payload.duplicateKeys;
    });
  },
});

export const { fileRemoved } = uploadSlice.actions;

export const selectFiles = (state: RootState) => state.upload.files;

export const selectFilesValidity = createSelector(selectFiles, (files) =>
  Object.fromEntries(
    files.map(({ key, exif }) => {
      const errors: FileValidityError[] = [];
      if (!exif.gpsLatitude || !exif.gpsLongitude) errors.push('missingLocation');
      if (!exif.dateTimeOriginal) errors.push('missingDate');
      return [key, errors];
    })
  )
);

export const selectUploadableFiles = createSelector(
  selectFiles,
  selectFilesValidity,
  (files, filesValidity) => files.filter(({ key }) => !filesValidity[key].length)
);
