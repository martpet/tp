import { FlexProps, ProgressCircle, View } from '@adobe/react-spectrum';
import { Label } from '@react-spectrum/label';
import { useSelector } from 'react-redux';

import { FileMeta } from '~/common/types';
import { selectProgress } from '~/features/upload';

type Props = Omit<FlexProps, 'children'> & {
  file: FileMeta;
};

export function ProgressIndicator({ file }: Props) {
  const progress = useSelector(selectProgress)[file.id] || 0;
  const formattedProgress = `${Number(progress.toFixed(0))}%`;
  const progressDomId = 'upload-progress-label';
  const isPercVisible = progress !== 0;

  return (
    <>
      <ProgressCircle
        value={progress}
        isIndeterminate={!isPercVisible || progress === 100}
        size="L"
        variant="overBackground"
        aria-labelledby="progressDomId"
        gridRow="1"
        gridColumn="1"
        minWidth="static-size-200"
        UNSAFE_style={{
          borderRadius: '50%',
          background: isPercVisible ? 'rgba(0,0,0,.6)' : 'none',
        }}
      />
      <View gridRow="1" gridColumn="1" zIndex={1}>
        {isPercVisible && (
          <Label
            elementType="span"
            id={progressDomId}
            UNSAFE_style={{ color: 'var(--spectrum-global-color-static-white)' }}
          >
            {formattedProgress}
          </Label>
        )}
      </View>
    </>
  );
}
