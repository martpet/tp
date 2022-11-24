import { Grid, minmax, repeat } from '@adobe/react-spectrum';
import { RefObject } from 'react';
import { useSelector } from 'react-redux';

import { selectAddedFiles } from '~/features/upload';

import { EmptyState } from './EmptyState';
import { Thumbnail } from './Thumbnail/Thumbnail';

export function ThumbnailsList() {
  const files = useSelector(selectAddedFiles);

  const handleImageLoad = (fileId: string, ref: RefObject<HTMLDivElement>) => {
    if (fileId === files.at(-1)?.id) {
      setTimeout(() => {
        ref.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      });
    }
  };

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
        <Thumbnail key={file.id} file={file} onImgLoad={handleImageLoad} />
      ))}
    </Grid>
  );
}
