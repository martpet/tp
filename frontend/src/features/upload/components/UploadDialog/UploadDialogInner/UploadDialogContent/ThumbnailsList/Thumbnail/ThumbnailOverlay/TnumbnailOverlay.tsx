import { Grid, GridProps } from '@adobe/react-spectrum';
import { useSelector } from 'react-redux';

import { FileMeta } from '~/common/types';
import { selectUploadStatus } from '~/features/upload';

import { Progress } from './Progress';

type Props = Omit<GridProps, 'children'> & {
  file: FileMeta;
};

export function TnumbnailOverlay({ file, ...containerProps }: Props) {
  const uploadStatus = useSelector(selectUploadStatus);

  if (uploadStatus === 'idle') {
    return null;
  }

  return (
    <Grid
      gap="size-100"
      {...containerProps}
      alignItems="center"
      justifyItems="center"
      UNSAFE_style={{ background: 'rgba(0,0,0,.2)' }}
    >
      <Progress file={file} />
    </Grid>
  );
}
