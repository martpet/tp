export type UploadError =
  | MissingExifDataError
  | 'fileTooBig'
  | 'alreadySelected'
  | 'alreadyUploaded'
  | 'transferFailed';

export type MissingExifDataError = 'missingLocation' | 'missingDate';
