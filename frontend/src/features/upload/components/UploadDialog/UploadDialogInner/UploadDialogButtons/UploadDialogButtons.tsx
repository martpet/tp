import { Button, useDialogContainer } from '@adobe/react-spectrum';
import { FormattedMessage } from 'react-intl';

import { useAppSelector } from '~/common/hooks';
import { selectFiles, selectUploadableFiles } from '~/features/upload';

import { AddFilesButton } from '../AddFilesButton';
import { StartUploadButton } from './StartUploadButton';

export function UploadDialogButtons() {
  const { dismiss } = useDialogContainer();
  const files = useAppSelector(selectFiles);
  const uploadableFiles = useAppSelector(selectUploadableFiles);

  const closeText = (
    <FormattedMessage defaultMessage="Close" description="upload dialog close button" />
  );

  const hideText = (
    <FormattedMessage defaultMessage="Hide" description="upload dialog hide button" />
  );

  return (
    <>
      {Boolean(uploadableFiles.length) && <StartUploadButton />}
      {Boolean(files.length) && <AddFilesButton variant="secondary" />}

      <Button variant="secondary" onPress={dismiss}>
        {files.length ? hideText : closeText}
      </Button>
    </>
  );
}
