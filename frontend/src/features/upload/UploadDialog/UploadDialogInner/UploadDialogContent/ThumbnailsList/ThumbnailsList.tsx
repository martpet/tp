import { Grid, minmax, repeat } from '@adobe/react-spectrum';
import { useEffect, useRef } from 'react';

import { useAppSelector } from '~/common/hooks';
import { selectFiles } from '~/features/upload';
import { FileMeta } from '~/features/upload/types';

import { EmptyState } from './EmptyState';
import { Thumbnail } from './Thumbnail';

export function ThumbnailsList() {
  const files = useAppSelector(selectFiles);
  const lastThumbnailRef = useRef<HTMLDivElement>(null);
  const prevFilesRef = useRef<FileMeta[]>([]);
  const isNewFileAdded = files.length > prevFilesRef.current.length;

  useEffect(() => {
    requestAnimationFrame(() => {
      if (isNewFileAdded) lastThumbnailRef.current?.scrollIntoView();
      prevFilesRef.current = files;
    });
  }, [files]);

  if (!files.length) {
    return <EmptyState />;
  }

  return (
    <Grid
      columns={{ S: repeat('auto-fill', minmax('size-5000', '1fr')) }}
      columnGap="size-300"
      rowGap="size-350"
    >
      {files.map((file, index) => (
        <div {...(index === files.length - 1 && { ref: lastThumbnailRef })}>
          <Thumbnail file={file} key={file.key} />
        </div>
      ))}
    </Grid>
  );
}
