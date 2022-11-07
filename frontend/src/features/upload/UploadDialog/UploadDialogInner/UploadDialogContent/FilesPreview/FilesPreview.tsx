import { Grid, minmax, repeat } from '@adobe/react-spectrum';

import { useAppSelector } from '~/common/hooks';
import { selectFiles } from '~/features/upload';

import { EmptyState } from './EmptyState';
import { Thumbnail } from './Thumbnail';

export function FilesPreview() {
  const files = useAppSelector(selectFiles);

  if (!files.length) {
    return <EmptyState />;
  }

  return (
    <Grid
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
