export type FileMeta = {
  key: string;
  name: string;
  objectURL: string;
};

export type FileMetaWithBlob = FileMeta & {
  blob: File;
};
