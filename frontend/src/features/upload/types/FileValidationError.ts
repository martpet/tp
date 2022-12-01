export type FileValidationError = FileMissingMetaDataError | 'maxSizeExceeded';

export type FileMissingMetaDataError = 'missingLocation' | 'missingDate';
