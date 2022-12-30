import { Button, Flex, FlexProps } from '@adobe/react-spectrum';
import { isAppleDevice } from '@react-aria/utils';
import { useIsMobileDevice } from '@react-spectrum/utils';
import Close from '@spectrum-icons/workflow/Close';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '~/common/hooks';
import {
  FileMeta,
  removeFile,
  selectCompletedUploads,
  selectTransferredFiles,
  selectUploadFlowStatus,
} from '~/features/upload';

type Props = Omit<FlexProps, 'children'> & {
  file: FileMeta;
};

export function ThumbnailRemoveButton({ file, ...flexProps }: Props) {
  const { formatMessage } = useIntl();
  const uploadFlow = useSelector(selectUploadFlowStatus);
  const completedUploads = useSelector(selectCompletedUploads);
  const transferredFiles = useSelector(selectTransferredFiles);
  const isMobile = useIsMobileDevice();
  const isOnLeftSide = isAppleDevice() && !isMobile;
  const dispatch = useAppDispatch();
  const isComplete = completedUploads.includes(file);
  const isTransferred = transferredFiles.includes(file);

  if (isComplete || (isTransferred && uploadFlow === 'creatingPhotos')) {
    return null;
  }

  return (
    <Flex
      {...flexProps}
      direction={isOnLeftSide ? 'row' : 'row-reverse'}
      UNSAFE_style={{ padding: 'var(--spectrum-global-dimension-size-40)' }}
    >
      <Button
        onPress={() => dispatch(removeFile(file.id))}
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
