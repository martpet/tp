import { Grid, minmax, repeat } from '@adobe/react-spectrum';
import { createDOMRef } from '@react-spectrum/utils';
import { useEffect, useRef } from 'react';

import { useAppSelector } from '~/common/hooks';
import { selectFiles } from '~/features/upload';
import { FileMeta } from '~/features/upload/types';

import { EmptyState } from './EmptyState';
import { Thumbnail } from './Thumbnail';

export function FilesPreview() {
  const files = useAppSelector(selectFiles);
  const prevFiles = useRef<FileMeta[]>([]);
  const isNewFileAdded = files.length > prevFiles.current.length;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isNewFileAdded) {
      requestAnimationFrame(() => containerRef.current?.scrollIntoView(false));
      prevFiles.current = files;
    }
  }, [files]);

  if (!files.length) {
    return <EmptyState />;
  }

  return (
    <Grid
      {...createDOMRef(containerRef)}
      columns={{ S: repeat('auto-fill', minmax('size-5000', '1fr')) }}
      columnGap="size-300"
      rowGap="size-350"
    >
      {files.map((file) => (
        <Thumbnail file={file} key={file.key} />
      ))}
    </Grid>
  );
}
