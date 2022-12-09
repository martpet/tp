import { createSelector } from '@reduxjs/toolkit';

import { maxPhotoUploadSize } from '~/common/consts';
import { RootState } from '~/common/types';
import { selectIsLoggedIn } from '~/features/me';
import { UploadError, UploadState } from '~/features/upload';

export const selectUploadStatus = createSelector(
  selectIsLoggedIn,
  (state: RootState) => state.upload.status,
  (isLoggedIn, status): UploadState['status'] => {
    return isLoggedIn ? status : 'idle';
  }
);

export const selectFiles = (state: RootState) => state.upload.files;

export const selectIsAddingFiles = (state: RootState) => state.upload.isAddingFiles;

export const selectFingerprintsInDb = (state: RootState) => state.upload.fingerprintsInDb;

export const selectIsTransferStarted = (state: RootState) =>
  state.upload.isTransferStarted;

export const selectPresignedPosts = (state: RootState) => state.upload.presignedPosts;

export const selectSuccessfulTransfers = (state: RootState) =>
  state.upload.successfulTransfers;

export const selectFailedTransfers = (state: RootState) => state.upload.failedTransfers;

export const selectTransfersProgress = (state: RootState) =>
  state.upload.transfersProgress;

export const selectFilesErrors = createSelector(
  selectFiles,
  selectFingerprintsInDb,
  selectFailedTransfers,
  (files, fingerprintsInDb, failedTransfers) => {
    const digests: string[] = [];
    return Object.fromEntries(
      files.map(({ id, digest, fingerprint, size, exif }) => {
        const { gpsLatitude, gpsLongitude, dateTimeOriginal } = exif;
        const errors: UploadError[] = [];

        if (size > maxPhotoUploadSize) errors.push('fileTooBig');
        if (!gpsLatitude || !gpsLongitude) errors.push('missingLocation');
        if (!dateTimeOriginal) errors.push('missingDate');
        if (fingerprintsInDb.includes(fingerprint)) errors.push('alreadyUploaded');
        if (failedTransfers.includes(id)) errors.push('transferFailed');
        if (digests.includes(digest)) errors.push('alreadySelected');

        digests.push(digest);
        return [id, errors];
      })
    );
  }
);

export const selectUploadableFiles = createSelector(
  selectFiles,
  selectFilesErrors,
  (files, errors) => files.filter((file) => !errors[file.id].length)
);

export const selectTransferredFiles = createSelector(
  selectUploadableFiles,
  selectSuccessfulTransfers,
  (files, successfulTransfers) =>
    files.filter(({ id }) => successfulTransfers.includes(id))
);
