import { FlexProps, Grid, ProgressCircle, View } from '@adobe/react-spectrum';
import { Label } from '@react-spectrum/label';
import { useSelector } from 'react-redux';

import { FileMeta } from '~/common/types';
import { selectTransfersProgress, selectUploadStatus } from '~/features/upload';

type Props = Omit<FlexProps, 'children'> & {
  file: FileMeta;
};

export function TnumbnailOverlay({ file, ...flexProps }: Props) {
  const uploadStatus = useSelector(selectUploadStatus);
  const progress = useSelector(selectTransfersProgress)[file.fingerprint] || 0;
  const formattedPerc = `${Number(progress.toFixed(0))}%`;

  if (uploadStatus === 'idle') {
    return null;
  }

  return (
    <Grid
      gap="size-100"
      {...flexProps}
      alignItems="center"
      justifyItems="center"
      UNSAFE_style={{
        background: 'rgba(0,0,0,.2)',
      }}
    >
      <ProgressCircle
        variant="overBackground"
        gridRow="1"
        gridColumn="1"
        size="L"
        value={progress}
        UNSAFE_style={{
          borderRadius: '50%',
          background: 'rgba(0,0,0,.65)',
        }}
        minWidth="static-size-200"
      />

      <View gridRow="1" gridColumn="1" UNSAFE_style={{ color: 'white' }} zIndex={2}>
        <Label>{formattedPerc}</Label>
      </View>
    </Grid>
  );
}
