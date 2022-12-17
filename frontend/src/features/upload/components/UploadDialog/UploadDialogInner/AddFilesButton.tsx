import { Button, SpectrumButtonProps, Text } from '@adobe/react-spectrum';
import AddToSelectionIcon from '@spectrum-icons/workflow/AddToSelection';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { SetOptional } from 'type-fest';

import { Spinner } from '~/common/components';
import { useAppDispatch } from '~/common/hooks';
import {
  addFiles,
  selectFiles,
  selectIsAddingFiles,
  selectUploadFlowInProgress,
} from '~/features/upload';

type Props = SetOptional<SpectrumButtonProps, 'variant'>;

export function AddFilesButton({ variant = 'cta', ...buttonProps }: Props) {
  const files = useSelector(selectFiles);
  const isAddingFiles = useSelector(selectIsAddingFiles);
  const isFlowInProgress = useSelector(selectUploadFlowInProgress);
  const dispatch = useAppDispatch();

  const inputElement = useMemo(() => {
    const el = document.createElement('input');
    el.type = 'file';
    el.multiple = true;
    el.accept = 'image/jpeg';
    el.addEventListener('change', () => {
      if (el.files) dispatch(addFiles(el.files));
    });
    return el;
  }, []);

  const handleClick = () => {
    inputElement.value = '';
    inputElement.click();
    import('exifreader'); // preload exif reader
  };

  return (
    <Button
      variant={variant}
      onPress={handleClick}
      isDisabled={isAddingFiles || isFlowInProgress}
      {...buttonProps}
    >
      {!!files.length && !isAddingFiles && <AddToSelectionIcon />}
      {isAddingFiles && <Spinner size="S" marginEnd="size-100" />}

      <Text>
        {!files.length ? (
          <FormattedMessage
            defaultMessage="Select files"
            description="button choose files (initial state)"
          />
        ) : (
          <FormattedMessage
            defaultMessage="Add more files"
            description="button choose files (with added files)"
          />
        )}
      </Text>
    </Button>
  );
}
