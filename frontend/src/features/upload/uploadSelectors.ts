import { createSelector } from '@reduxjs/toolkit';

import { maxPhotoUploadSize } from '~/common/consts';
import { RootState } from '~/common/types';
import { selectIsLoggedIn } from '~/features/me';
import { UploadError, UploadState } from '~/features/upload';

export const selectIsAddingFiles = (state: RootState) => state.upload.isAddingFiles;
export const selectFiles = (state: RootState) => state.upload.files;
export const selectFingerprintsInDb = (state: RootState) => state.upload.fingerprintsInDb;
export const selectPresignedPosts = (state: RootState) => state.upload.presignedPosts;
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

export const selectUploadFlowInProgress = createSelector(
  selectUploadFlowStatus,
  (status) =>
    status === 'pending' || status === 'transferring' || status === 'creatingPhotos'
);

export const selectTransferredFiles = createSelector(
  selectFiles,
  (state: RootState) => state.upload.successfulTransfers,
  (files, successfulTransfers) =>
    files.filter(({ id }) => successfulTransfers.includes(id))
);

export const selectFailedToTransferFiles = createSelector(
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
  selectFailedToTransferFiles,
  selectCompletedUploads,
  selectUploadFlowStatus,
  (files, fingerprintsInDb, failedTransfersFiles, completedUploads, flowStatus) => {
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

export const selectUnuploadableFiles = createSelector(
  selectFiles,
  selectUploadableFiles,
  selectCompletedUploads,
  (files, uploadableFiles, completedUploads) =>
    files.filter(
      (file) => !uploadableFiles.includes(file) && !completedUploads.includes(file)
    )
);

export const selectFilesPendingTransfer = createSelector(
  selectUploadableFiles,
  selectTransferredFiles,
  (uploadableFiles, transferredFiles) =>
    uploadableFiles.filter((file) => !transferredFiles.includes(file))
);

export const selectFilesPendingCreation = createSelector(
  selectTransferredFiles,
  selectCompletedUploads,
  (transferredFiles, completedUploads) =>
    transferredFiles.filter((file) => !completedUploads.includes(file))
);

export const selectFailedUploads = createSelector(
  selectUploadFlowStatus,
  selectUploadableFiles,
  selectFailedToTransferFiles,
  (flowStatus, uploadableFiles, failedTransferFiles) =>
    flowStatus === 'error' ? uploadableFiles : failedTransferFiles
);
