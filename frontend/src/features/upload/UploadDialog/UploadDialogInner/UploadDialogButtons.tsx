import { Button, useDialogContainer } from '@adobe/react-spectrum';
import { FormattedMessage } from 'react-intl';

import { useAppSelector } from '~/common/hooks';
import { selectFiles } from '~/features/upload';

import { ButtonAddFiles } from './ButtonAddFiles';

export function UploadDialogButtons() {
  const { dismiss } = useDialogContainer();
  const files = useAppSelector(selectFiles);

  return (
    <>
      {files.length > 0 && <ButtonAddFiles />}
      <Button variant="secondary" onPress={dismiss}>
        <FormattedMessage
          defaultMessage="Close"
          description="upload dialog close button"
        />
      </Button>
    </>
  );
}
