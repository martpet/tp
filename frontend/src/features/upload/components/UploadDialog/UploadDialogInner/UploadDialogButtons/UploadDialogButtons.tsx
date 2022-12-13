import { Button, useDialogContainer } from '@adobe/react-spectrum';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '~/common/hooks';
import {
  selectFiles,
  selectUploadableFiles,
  selectUploadFlowEnded,
  userIsDone,
} from '~/features/upload';

import { AddFilesButton } from '../AddFilesButton';
import { StartUploadButton } from './StartUploadButton';

export function UploadDialogButtons() {
  const { dismiss } = useDialogContainer();
  const files = useSelector(selectFiles);
  const uploadableFiles = useSelector(selectUploadableFiles);
  const isFlowEnded = useSelector(selectUploadFlowEnded);
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const buttonCloseText = formatMessage({
    defaultMessage: 'Close',
    description: 'upload dialog close button',
  });

  const buttonHideText = formatMessage({
    defaultMessage: 'Hide',
    description: 'upload dialog hide button',
  });

  return (
    <>
      {uploadableFiles.length > 0 && <StartUploadButton />}

      {files.length > 0 && <AddFilesButton variant="secondary" />}

      {!isFlowEnded && (
        <Button variant="secondary" onPress={dismiss}>
          {files.length ? buttonHideText : buttonCloseText}
        </Button>
      )}

      {isFlowEnded && (
        <Button
          variant={uploadableFiles.length > 0 ? 'secondary' : 'cta'}
          onPress={() => {
            dismiss();
            setTimeout(() => dispatch(userIsDone()), 500);
          }}
        >
          <FormattedMessage
            defaultMessage="I'm done"
            description="upload dialog done button"
          />
        </Button>
      )}
    </>
  );
}
