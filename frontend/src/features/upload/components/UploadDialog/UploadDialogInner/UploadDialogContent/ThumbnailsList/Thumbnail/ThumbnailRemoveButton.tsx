import { Button, Flex, FlexProps } from '@adobe/react-spectrum';
import { isAppleDevice } from '@react-aria/utils';
import { useIsMobileDevice } from '@react-spectrum/utils';
import Close from '@spectrum-icons/workflow/Close';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '~/common/hooks';
import {
  FileMeta,
  fileRemoved,
  selectCompletedUploads,
  selectFilesErrors,
  selectProgress,
} from '~/features/upload';

type Props = Omit<FlexProps, 'children'> & {
  file: FileMeta;
};

export function ThumbnailRemoveButton({ file, ...flexProps }: Props) {
  const { formatMessage } = useIntl();
  const filesErrors = useSelector(selectFilesErrors);
  const transfersProgress = useSelector(selectProgress);
  const completedUploads = useSelector(selectCompletedUploads);
  const dispatch = useAppDispatch();
  const isMobile = useIsMobileDevice();
  const isOnLeftSide = isAppleDevice() && !isMobile;
  const failedToUpload = filesErrors[file.id].includes('uploadFailed');
  const progress = transfersProgress[file.id];
  const isUploadComplete = completedUploads.includes(file);

  const handleClick = (fileId: string) => () => {
    dispatch(fileRemoved(fileId));
  };

  if (isUploadComplete || (progress === 100 && !failedToUpload)) {
    return null;
  }

  return (
    <Flex
      {...flexProps}
      direction={isOnLeftSide ? 'row' : 'row-reverse'}
      UNSAFE_style={{ padding: 'var(--spectrum-global-dimension-size-40)' }}
    >
      <Button
        onPress={handleClick(file.id)}
        variant="overBackground"
        style="fill"
        UNSAFE_style={{
          opacity: '0.9',
          transform: isMobile ? 'none' : 'scale(0.8)',
        }}
        aria-label={formatMessage({
          defaultMessage: 'Remove',
          description: 'upload thumbnail remove button aria label',
        })}
      >
        <Close />
      </Button>
    </Flex>
  );
}
