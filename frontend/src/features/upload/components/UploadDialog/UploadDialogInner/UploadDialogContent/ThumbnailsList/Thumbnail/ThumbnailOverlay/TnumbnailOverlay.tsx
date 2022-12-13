import { Grid, GridProps } from '@adobe/react-spectrum';
import { useSelector } from 'react-redux';

import { FileMeta } from '~/common/types';
import {
  selectCompletedUploads,
  selectFilesErrors,
  selectUploadFlowEnded,
  selectUploadFlowStatus,
} from '~/features/upload';

import { Progress } from './Progress';

type Props = Omit<GridProps, 'children'> & {
  file: FileMeta;
};

export function TnumbnailOverlay({ file, ...containerProps }: Props) {
  const flowStatus = useSelector(selectUploadFlowStatus);
  const isFlowEnded = useSelector(selectUploadFlowEnded);
  const completedUploads = useSelector(selectCompletedUploads);
  const filesErrors = useSelector(selectFilesErrors);
  const isUploaded = completedUploads.includes(file);
  const hasErrors = filesErrors[file.id].length > 0;

  if (flowStatus === 'idle' || hasErrors || isUploaded || isFlowEnded) {
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
