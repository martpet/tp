import { Grid, GridProps } from '@adobe/react-spectrum';
import { useSelector } from 'react-redux';

import { FileMeta } from '~/common/types';
import {
  selectCompletedUploads,
  selectFilesErrors,
  selectUploadFlowInProgress,
} from '~/features/upload';

import { ProgressIndicator } from './ProgressIndicator';

type Props = Omit<GridProps, 'children'> & {
  file: FileMeta;
};

export function TnumbnailOverlay({ file, ...containerProps }: Props) {
  const isInProgress = useSelector(selectUploadFlowInProgress);
  const completedUploads = useSelector(selectCompletedUploads);
  const filesErrors = useSelector(selectFilesErrors);
  const isComplete = completedUploads.includes(file);
  const hasErrors = filesErrors[file.id].length > 0;
  const showProgress = isInProgress && !isComplete && !hasErrors;

  if (!showProgress) {
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
