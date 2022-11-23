import { Button, useProvider } from '@adobe/react-spectrum';
import { isAppleDevice } from '@react-aria/utils';
import { useIsMobileDevice } from '@react-spectrum/utils';
import Close from '@spectrum-icons/workflow/Close';
import { useIntl } from 'react-intl';

import { useAppDispatch, useAppSelector } from '~/common/hooks';
import { FileMeta } from '~/features/upload/types';
import { fileRemoved, selectUploadStatus } from '~/features/upload/uploadSlice';

type Props = {
  file: FileMeta;
};

export function ThumbnailRemoveButton({ file }: Props) {
  const { formatMessage } = useIntl();
  const uploadStatus = useAppSelector(selectUploadStatus);
  const dispatch = useAppDispatch();
  const { colorScheme } = useProvider();
  const isButtonOnLeft = isAppleDevice() && !useIsMobileDevice();

  const handleClick = (fileId: string) => () => {
    dispatch(fileRemoved(fileId));
  };

  if (uploadStatus === 'inProgress') {
    return null;
  }

  return (
    <Button
      onPress={handleClick(file.id)}
      variant={colorScheme === 'light' ? 'primary' : 'overBackground'}
      style="fill"
      UNSAFE_style={{
        transformOrigin: `top ${isButtonOnLeft ? 'left' : 'right'}`,
        transform: `scale(0.7) translate(${isButtonOnLeft ? '-' : ''}24.5%, -24.5%)`,
        position: 'absolute',
        left: isButtonOnLeft ? '0' : 'auto',
        right: isButtonOnLeft ? 'auto' : '0',
        top: '0',
      }}
      aria-label={formatMessage({
        defaultMessage: 'Remove',
        description: 'upload thumbnail remove button aria label',
      })}
    >
      <Close />
    </Button>
  );
}
