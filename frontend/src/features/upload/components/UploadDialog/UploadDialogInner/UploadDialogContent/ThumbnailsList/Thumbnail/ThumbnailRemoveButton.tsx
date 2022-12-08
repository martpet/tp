import { Button } from '@adobe/react-spectrum';
import { isAppleDevice } from '@react-aria/utils';
import { useIsMobileDevice } from '@react-spectrum/utils';
import Close from '@spectrum-icons/workflow/Close';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '~/common/hooks';
import { fileRemoved, selectSuccessfulTransfers } from '~/features/upload';
import { FileMeta } from '~/features/upload/types';

type Props = {
  file: FileMeta;
};

export function ThumbnailRemoveButton({ file }: Props) {
  const { formatMessage } = useIntl();
  const successfulTransfers = useSelector(selectSuccessfulTransfers);
  const isTransferred = successfulTransfers.includes(file.id);
  const dispatch = useAppDispatch();
  const isMobile = useIsMobileDevice();
  const isOnLeftSide = isAppleDevice() && !isMobile;
  const offset = 'var(--spectrum-global-dimension-size-40)';

  const handleClick = (fileId: string) => () => {
    dispatch(fileRemoved(fileId));
  };

  if (isTransferred) {
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
        right: isOnLeftSide ? 'auto' : offset,
        left: isOnLeftSide ? offset : 'auto',
        transform: isMobile ? 'none' : 'scale(0.8)',
        opacity: '0.9',
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
