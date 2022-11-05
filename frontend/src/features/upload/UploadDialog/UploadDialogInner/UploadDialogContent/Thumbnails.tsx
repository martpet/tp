import { Grid, minmax, repeat } from '@adobe/react-spectrum';
import { DragEventHandler } from 'react';

import { useAppSelector } from '~/common/hooks';
import { selectFiles } from '~/features/upload';

export function Thumbnails() {
  const files = useAppSelector(selectFiles);

  const preventImageDrag: DragEventHandler<HTMLImageElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Grid
      columns={{ S: repeat('auto-fill', minmax('size-5000', '1fr')) }}
      columnGap="size-300"
      rowGap="size-350"
    >
      {files.map((file) => (
        <img
          key={file.key}
          alt={file.name}
          src={file.objectURL}
          onDragStart={preventImageDrag}
          style={{ width: '100%', display: 'block' }}
        />
      ))}
    </Grid>
  );
}
