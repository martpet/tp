export type FileError = FileMissingMetaDataError | 'maxSizeExceeded' | 'alreadyUploaded';

export type FileMissingMetaDataError = 'missingLocation' | 'missingDate';
