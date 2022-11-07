import { Button, SpectrumButtonProps } from '@adobe/react-spectrum';
import { ChangeEventHandler, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { SetOptional } from 'type-fest';

import { useAppDispatch, useAppSelector } from '~/common/hooks';
import { acceptedUploadFileTypes } from '~/features/upload/consts';
import { addFiles } from '~/features/upload/thunks';
import { selectFiles } from '~/features/upload/uploadSlice';

type Props = SetOptional<SpectrumButtonProps, 'variant'>;

export function ButtonAddFiles({ variant = 'cta', ...buttonProps }: Props) {
  const files = useAppSelector(selectFiles);
  const inputElRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const handleButtonPress = () => {
    inputElRef.current?.click();
    import('exifreader');
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { files: newFiles } = event.currentTarget;
    if (newFiles) {
      dispatch(addFiles(newFiles));
    }
  };

  return (
    <>
      <input
        hidden
        ref={inputElRef}
        type="file"
        multiple
        accept={acceptedUploadFileTypes.join(',')}
        onChange={handleInputChange}
      />

      <Button variant={variant} onPress={handleButtonPress} {...buttonProps}>
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
      </Button>
    </>
  );
}
