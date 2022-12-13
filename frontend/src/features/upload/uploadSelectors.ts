import { createSelector } from '@reduxjs/toolkit';

import { maxPhotoUploadSize } from '~/common/consts';
import { RootState } from '~/common/types';
import { selectIsLoggedIn } from '~/features/me';
import { UploadError, UploadState } from '~/features/upload';

export const selectIsAddingFiles = (state: RootState) => state.upload.isAddingFiles;
export const selectFiles = (state: RootState) => state.upload.files;
export const selectFingerprintsInDb = (state: RootState) => state.upload.fingerprintsInDb;
export const selectPresignedPosts = (state: RootState) => state.upload.presignedPosts;
export const selectTransferStarted = (state: RootState) => state.upload.isTransferStarted;
export const selectProgress = (state: RootState) => state.upload.transfersProgress;

export const selectUploadFlowStatus = createSelector(
  selectIsLoggedIn,
  (state: RootState) => state.upload.flowStatus,
  (isLoggedIn, status): UploadState['flowStatus'] => (isLoggedIn ? status : 'idle')
);

export const selectUploadFlowEnded = createSelector(
  selectUploadFlowStatus,
  (status) => status === 'done' || status === 'error'
);

export const selectTransferredFiles = createSelector(
  selectFiles,
  (state: RootState) => state.upload.successfulTransfers,
  (files, successfulTransfers) =>
    files.filter(({ id }) => successfulTransfers.includes(id))
);

export const selectFailedTransferFiles = createSelector(
  selectFiles,
  (state: RootState) => state.upload.failedTransfers,
  (files, failedTransfers) => files.filter(({ id }) => failedTransfers.includes(id))
);

export const selectCompletedUploads = createSelector(
  selectFiles,
  (state: RootState) => state.upload.completedUploads,
  (files, completedUploads) => files.filter(({ id }) => completedUploads.includes(id))
);

export const selectFilesErrors = createSelector(
  selectFiles,
  selectFingerprintsInDb,
  selectFailedTransferFiles,
  selectUploadFlowStatus,
  selectCompletedUploads,
  (files, fingerprintsInDb, failedTransfersFiles, flowStatus, completedUploads) => {
    const digests: string[] = [];
    return Object.fromEntries(
      files.map((file) => {
        const errors: UploadError[] = [];
        const { id, digest, fingerprint, size, exif } = file;
        const { gpsLatitude, gpsLongitude, dateTimeOriginal } = exif;
        if (!completedUploads.includes(file)) {
          if (size > maxPhotoUploadSize) errors.push('fileTooBig');
          if (!gpsLatitude || !gpsLongitude) errors.push('missingLocation');
          if (!dateTimeOriginal) errors.push('missingDate');
          if (digests.includes(digest)) errors.push('alreadySelected');
          if (fingerprintsInDb.includes(fingerprint)) errors.push('alreadyUploaded');
          if (failedTransfersFiles.includes(file)) errors.push('uploadFailed');
          if (flowStatus === 'error') errors.push('uploadFailed');
        }
        digests.push(digest);
        return [id, errors];
      })
    );
  }
);

export const selectUploadableFiles = createSelector(
  selectFiles,
  selectFilesErrors,
  selectCompletedUploads,
  (files, filesErrors, completedUploads) =>
    files.filter((file) => {
      const errors = filesErrors[file.id].filter((error) => error !== 'uploadFailed');
      return errors.length === 0 && !completedUploads.includes(file);
    })
);

export const selectFailedUploads = createSelector(
  selectUploadFlowStatus,
  selectUploadableFiles,
  selectFailedTransferFiles,
  (flowStatus, uploadableFiles, failedTransferFiles) =>
    flowStatus === 'error' ? uploadableFiles : failedTransferFiles
);

export const selectNotUploadableFiles = createSelector(
  selectFiles,
  selectUploadableFiles,
  selectCompletedUploads,
  (files, uploadableFiles, completedUploads) =>
    files.filter(
      (file) => !completedUploads.includes(file) && !uploadableFiles.includes(file)
    )
);
