import { Grid, minmax, repeat } from '@adobe/react-spectrum';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { selectFiles } from '~/features/upload';

import { EmptyState } from './EmptyState';
import { Thumbnail } from './Thumbnail/Thumbnail';

export function ThumbnailsList() {
  const files = useSelector(selectFiles);
  const prevFiles = useRef(files);

  console.log('prevFiles.current.length', prevFiles.current.length);

  useEffect(() => {
    prevFiles.current = files;
  }, [files]);

  if (!files.length) {
    return <EmptyState />;
  }

  return (
    <Grid
      columns={{ S: repeat('auto-fill', minmax('size-5000', '1fr')) }}
      columnGap="size-300"
      rowGap="size-350"
      alignItems="start"
    >
      {files.map((file) => (
        <Thumbnail
          key={file.id}
          file={file}
          scollIntoView={file === files.at(prevFiles.current.length)}
        />
      ))}
    </Grid>
  );
}
