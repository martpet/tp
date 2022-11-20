import { ActionButton, Flex } from '@adobe/react-spectrum';
import { isAppleDevice } from '@react-aria/utils';
import Close from '@spectrum-icons/workflow/Close';
import { useIntl } from 'react-intl';

import { useAppDispatch, useAppSelector } from '~/common/hooks';
import { FileMeta } from '~/features/upload/types';
import { fileRemoved, selectUploadStatus } from '~/features/upload/uploadSlice';

type Props = {
  file: FileMeta;
};

export function ThumbnailRemoveButton({ file }: Props) {
  const { formatMessage } = useIntl();
  const uploadStatus = useAppSelector(selectUploadStatus);
  const dispatch = useAppDispatch();

  const handleRemove = (fileId: string) => () => {
    dispatch(fileRemoved(fileId));
  };

  return (
    <Flex
      justifyContent={isAppleDevice() ? 'start' : 'end'}
      gridColumn="1"
      gridRow="1"
      margin="size-25"
    >
      {uploadStatus !== 'pending' && (
        <ActionButton
          onPress={handleRemove(file.id)}
          UNSAFE_style={{ transform: 'scale(0.65)' }}
          aria-label={formatMessage({
            defaultMessage: 'Remove',
            description: 'upload thumbnail remove button aria label',
          })}
        >
          <Close />
        </ActionButton>
      )}
    </Flex>
  );
}
