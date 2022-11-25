import { Button } from '@adobe/react-spectrum';
import { isAppleDevice } from '@react-aria/utils';
import { useIsMobileDevice } from '@react-spectrum/utils';
import Close from '@spectrum-icons/workflow/Close';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '~/common/hooks';
import { fileRemoved, selectUploadStatus } from '~/features/upload';
import { FileMeta } from '~/features/upload/types';

type Props = {
  file: FileMeta;
};

export function ThumbnailRemoveButton({ file }: Props) {
  const { formatMessage } = useIntl();
  const uploadStatus = useSelector(selectUploadStatus);
  const dispatch = useAppDispatch();
  const isOnLeft = isAppleDevice() && !useIsMobileDevice();
  const offset = 2;

  const handleClick = (fileId: string) => () => {
    dispatch(fileRemoved(fileId));
  };

  if (uploadStatus === 'pending') {
    return null;
  }

  return (
    <Button
      onPress={handleClick(file.id)}
      variant="overBackground"
      style="fill"
      UNSAFE_style={{
        position: 'absolute',
        top: offset,
        right: isOnLeft ? 'auto' : offset,
        left: isOnLeft ? offset : 'auto',
        transform: 'scale(0.8)',
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
