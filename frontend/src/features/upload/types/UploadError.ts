export type UploadError =
  | MissingExifDataError
  | 'fileTooBig'
  | 'alreadyUploaded'
  | 'transferFailed';

export type MissingExifDataError = 'missingLocation' | 'missingDate';
