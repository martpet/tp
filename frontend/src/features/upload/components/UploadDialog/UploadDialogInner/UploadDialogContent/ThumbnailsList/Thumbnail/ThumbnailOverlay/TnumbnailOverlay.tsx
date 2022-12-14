import { Grid, GridProps } from '@adobe/react-spectrum';
import { useSelector } from 'react-redux';

import { FileMeta } from '~/common/types';
import {
  selectCompletedUploads,
  selectFilesErrors,
  selectUploadFlowStatus,
} from '~/features/upload';

import { ProgressIndicator } from './ProgressIndicator';

type Props = Omit<GridProps, 'children'> & {
  file: FileMeta;
};

export function TnumbnailOverlay({ file, ...containerProps }: Props) {
  const flowStatus = useSelector(selectUploadFlowStatus);
  const completedUploads = useSelector(selectCompletedUploads);
  const filesErrors = useSelector(selectFilesErrors);
  const isUploaded = completedUploads.includes(file);
  const hasErrors = filesErrors[file.id].length > 0;

  const showProgressIndicator = flowStatus === 'pending' && !isUploaded && !hasErrors;

  if (!showProgressIndicator) {
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
      <ProgressIndicator file={file} />
    </Grid>
  );
}
