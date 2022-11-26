import { Button, useDialogContainer } from '@adobe/react-spectrum';
import { FormattedMessage } from 'react-intl';

import { useAppSelector } from '~/common/hooks';
import { selectAddedFiles, selectUploadableFiles } from '~/features/upload';

import { AddFilesButton } from '../AddFilesButton';
import { StartUploadButton } from './StartUploadButton';

export function UploadDialogButtons() {
  const { dismiss } = useDialogContainer();
  const files = useAppSelector(selectAddedFiles);
  const uploadableFiles = useAppSelector(selectUploadableFiles);

  return (
    <>
      {uploadableFiles.length > 0 && <StartUploadButton />}
      {files.length > 0 && <AddFilesButton variant="secondary" />}
      <Button variant="secondary" onPress={dismiss}>
        <FormattedMessage
          defaultMessage="Close"
          description="upload dialog close button"
        />
      </Button>
    </>
  );
}
