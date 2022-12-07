export type UploadError =
  | MissingExifDataError
  | 'maxSizeExceeded'
  | 'alreadyUploaded'
  | 'transferFailed';

export type MissingExifDataError = 'missingLocation' | 'missingDate';
