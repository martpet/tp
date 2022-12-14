import { Button, ProgressCircle, Text } from '@adobe/react-spectrum';
import UploadIcon from '@spectrum-icons/workflow/UploadToCloud';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '~/common/hooks';
import { selectUploadFlowStatus, uploadFlowStarted } from '~/features/upload';

export function StartUploadButton() {
  const dispatch = useAppDispatch();
  const flowStatus = useSelector(selectUploadFlowStatus);
  const isUploading = flowStatus === 'pending';
  const buttonId = 'start-upload-button';

  const handleClick = () => {
    dispatch(uploadFlowStarted());
  };

  const idleState = (
    <>
      <UploadIcon />
      <Text>
        <FormattedMessage
          defaultMessage="Start upload"
          description="upload dialog upload button"
        />
      </Text>
    </>
  );

  const progressState = (
    <>
      <ProgressCircle
        size="S"
        isIndeterminate
        marginEnd="size-125"
        aria-labelledby={buttonId}
      />
      <Text>
        <FormattedMessage
          defaultMessage="Uploading…"
          description="upload dialog upload button - uploading"
        />
      </Text>
    </>
  );

  return (
    <Button variant="cta" onPress={handleClick} isDisabled={isUploading} id={buttonId}>
      {isUploading ? progressState : idleState}
    </Button>
  );
}
