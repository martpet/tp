import { ActionButton } from '@adobe/react-spectrum';
import UploadIcon from '@spectrum-icons/workflow/UploadToCloudOutline';
import { useIntl } from 'react-intl';

import { UploadDialogLazy, UploadDialogTrigger } from '~/features/upload';

export function UploadButton() {
  const { formatMessage } = useIntl();

  return (
    <UploadDialogTrigger>
      <ActionButton
        isQuiet
        aria-label={formatMessage({
          defaultMessage: 'Upload photos',
          description: 'toolbar upload button aria label',
        })}
      >
        <UploadIcon />
      </ActionButton>
      <UploadDialogLazy />
    </UploadDialogTrigger>
  );
}
