// TODO: Add tooltip to ActionButton when fixed: https://github.com/adobe/react-spectrum/issues/3009

import {
  ActionButton,
  DialogTrigger,
  Tooltip,
  TooltipTrigger,
} from '@adobe/react-spectrum';
import { useIsMobileDevice } from '@react-spectrum/utils';
import UploadIcon from '@spectrum-icons/workflow/UploadToCloudOutline';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '~/common/hooks';
import { selectUploadDialogOpened, uploadDialogToggled } from '~/features/app';
import { selectUploadStatus, UploadDialog } from '~/features/upload';

export function UploadButton() {
  const isDialogOpen = useSelector(selectUploadDialogOpened);
  const uploadStatus = useSelector(selectUploadStatus);
  const { formatMessage } = useIntl();
  const isMobile = useIsMobileDevice();
  const dispatch = useAppDispatch();

  return (
    <TooltipTrigger
      isOpen={(uploadStatus === 'success' || uploadStatus === 'error') && !isDialogOpen}
    >
      <DialogTrigger
        isOpen={isDialogOpen}
        onOpenChange={(isOpen) => dispatch(uploadDialogToggled(isOpen))}
        type={isMobile ? 'fullscreenTakeover' : 'fullscreen'}
      >
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
      <Tooltip>
        {uploadStatus === 'success' && 'It is done'}
        {uploadStatus === 'error' && 'It failed'}
      </Tooltip>
    </TooltipTrigger>
  );
}
