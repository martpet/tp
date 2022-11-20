import { Button, useProvider } from '@adobe/react-spectrum';
import Close from '@spectrum-icons/workflow/Close';
import { useIntl } from 'react-intl';
import { isAppleDevice } from '@react-aria/utils';

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

  const handleClick = (fileId: string) => () => {
    dispatch(fileRemoved(fileId));
  };

  if (uploadStatus === 'pending') {
    return null;
  }

  return (
    <Button
      onPress={handleClick(file.id)}
      variant={colorScheme === 'light' ? 'primary' : 'overBackground'}
      style="fill"
      UNSAFE_style={{
        transformOrigin: `top ${isAppleDevice() ? 'left' : 'right'}`,
        transform: `scale(0.7) translate(${isAppleDevice() ? '-' : ''}24.5%, -24.5%)`,
        position: 'absolute',
        left: isAppleDevice() ? '0' : 'auto',
        right: isAppleDevice() ? 'auto' : '0',
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
