// TODO: Add tooltip to ActionButton when fixed: https://github.com/adobe/react-spectrum/issues/3009

import { ActionButton, DialogTrigger } from '@adobe/react-spectrum';
import { useIsMobileDevice } from '@react-spectrum/utils';
import UploadIcon from '@spectrum-icons/workflow/UploadToCloudOutline';
import { useIntl } from 'react-intl';

import { UploadDialog } from '~/features/upload';

export function UploadButton() {
  const { formatMessage } = useIntl();
  const isMobile = useIsMobileDevice();

  return (
    <DialogTrigger type={isMobile ? 'fullscreenTakeover' : 'fullscreen'}>
      <ActionButton
        isQuiet
        aria-label={formatMessage({
          defaultMessage: 'Upload photos',
          description: 'toolbar upload button aria label',
        })}
      >
        <UploadIcon />
      </ActionButton>
      <UploadDialog />
    </DialogTrigger>
  );
}
