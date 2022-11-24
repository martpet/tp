import { Button, Text } from '@adobe/react-spectrum';
import UploadIcon from '@spectrum-icons/workflow/UploadToCloud';
import { FormattedMessage } from 'react-intl';

import { useAppDispatch, useAppSelector } from '~/common/hooks';
import { upload } from '~/features/upload/thunks';
import { selectUploadStatus } from '~/features/upload/uploadSlice';

export function UploadButton() {
  const dispatch = useAppDispatch();
  const uploadStatus = useAppSelector(selectUploadStatus);

  const handleClick = () => {
    dispatch(upload());
  };

  return (
    <Button
      variant="cta"
      onPress={handleClick}
      isDisabled={uploadStatus === 'pending'}
    >
      <UploadIcon />
      <Text>
        <FormattedMessage
          defaultMessage="Start upload"
          description="upload dialog upload button"
        />
      </Text>
    </Button>
  );
}
