export type UploadError =
  | MissingExifDataError
  | 'fileTooBig'
  | 'alreadySelected'
  | 'alreadyUploaded'
  | 'uploadFailed';

export type MissingExifDataError = 'missingLocation' | 'missingDate';
