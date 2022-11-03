export type FileMeta = {
  key: string;
  name: string;
};

export type FileMetaWithBlob = FileMeta & {
  blob: File;
};
