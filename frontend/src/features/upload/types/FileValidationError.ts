export type FileValidationError =
  | FileMissingMetaDataError
  | 'maxSizeExceeded'
  | 'isDuplicate';

export type FileMissingMetaDataError = 'missingLocation' | 'missingDate';
