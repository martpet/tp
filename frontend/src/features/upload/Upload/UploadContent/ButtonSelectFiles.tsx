import { Button } from '@adobe/react-spectrum';
import { ChangeEventHandler, useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import { useAppDispatch, useAppSelector } from '~/common/hooks';
import { addFiles } from '~/features/upload/thunks';
import { selectFiles } from '~/features/upload/uploadSlice';

import { acceptedUploadFileTypes } from './consts';

export function ButtonSelectFiles() {
  const { files } = useAppSelector(selectFiles);
  const isUploading = false; // todo: select from store
  const inputElRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const handleButtonPress = () => {
    inputElRef.current?.click();
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

      <Button variant="cta" isDisabled={isUploading} onPress={handleButtonPress}>
        {!files.length ? (
          <FormattedMessage
            defaultMessage="Select files"
            description="button choose files (initial state)"
          />
        ) : (
          <FormattedMessage
            defaultMessage="Select more files"
            description="button choose files (with added files)"
          />
        )}
      </Button>
    </>
  );
}
