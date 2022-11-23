import { Button, SpectrumButtonProps, Text } from '@adobe/react-spectrum';
import AddToSelection from '@spectrum-icons/workflow/AddToSelection';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { SetOptional } from 'type-fest';

import { useAppDispatch, useAppSelector } from '~/common/hooks';
import { acceptedUploadFileTypes } from '~/features/upload/consts';
import { addFiles } from '~/features/upload/thunks';
import { selectAddedFiles, selectUploadStatus } from '~/features/upload/uploadSlice';

type Props = SetOptional<SpectrumButtonProps, 'variant'>;

export function AddFilesButton({ variant = 'cta', ...buttonProps }: Props) {
  const files = useAppSelector(selectAddedFiles);
  const dispatch = useAppDispatch();
  const uploadStatus = useAppSelector(selectUploadStatus);

  const inputElement = useMemo(() => {
    const el = document.createElement('input');
    el.type = 'file';
    el.multiple = true;
    el.accept = acceptedUploadFileTypes.join(',');
    el.addEventListener('change', () => {
      if (el.files) dispatch(addFiles(el.files));
    });
    return el;
  }, []);

  const handleClick = () => {
    inputElement.value = '';
    inputElement.click();
    import('exifreader'); // start preloading exif reader
  };

  return (
    <Button
      variant={variant}
      onPress={handleClick}
      isDisabled={uploadStatus === 'inProgress'}
      {...buttonProps}
    >
      {!files.length ? (
        <FormattedMessage
          defaultMessage="Select files"
          description="button choose files (initial state)"
        />
      ) : (
        <>
          <AddToSelection />
          <Text>
            <FormattedMessage
              defaultMessage="Add more files"
              description="button choose files (with added files)"
            />
          </Text>
        </>
      )}
    </Button>
  );
}
