import { FlexProps, ProgressCircle, View } from '@adobe/react-spectrum';
import { Label } from '@react-spectrum/label';
import { useSelector } from 'react-redux';

import { FileMeta } from '~/common/types';
import { selectIsTransferStarted, selectTransfersProgress } from '~/features/upload';

type Props = Omit<FlexProps, 'children'> & {
  file: FileMeta;
};

export function Progress({ file }: Props) {
  const isTransferStarted = useSelector(selectIsTransferStarted);
  const progress = useSelector(selectTransfersProgress)[file.id] || 0;
  const formattedPerc = `${Number(progress.toFixed(0))}%`;
  const progresLabelId = 'upload-progress-label';

  return (
    <>
      <ProgressCircle
        value={progress}
        isIndeterminate={progress === 0}
        size="L"
        variant="overBackground"
        aria-labelledby="progresLabelId"
        gridRow="1"
        gridColumn="1"
        minWidth="static-size-200"
        UNSAFE_style={{
          borderRadius: '50%',
          background: isTransferStarted ? 'rgba(0,0,0,.6)' : 'none',
        }}
      />
      {isTransferStarted && (
        <View gridRow="1" gridColumn="1" zIndex={1}>
          <Label
            elementType="span"
            id={progresLabelId}
            UNSAFE_style={{ color: 'var(--spectrum-global-color-static-white)' }}
          >
            {formattedPerc}
          </Label>
        </View>
      )}
    </>
  );
}
