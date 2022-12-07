import { Flex, View } from '@adobe/react-spectrum';
import IconAlert from '@spectrum-icons/workflow/Alert';
import { ReactNode } from 'react';

import { useAppSelector } from '~/common/hooks';
import { selectFilesErrors } from '~/features/upload';
import { FileMeta, UploadError } from '~/features/upload/types';

import { AlreadyUploaded } from './AlreadyUploaded';
import { FileTooBig } from './FileTooBig';
import { MissingExifData } from './MissingExifData';
import { TransferFailed } from './TransferFailed';

type Props = {
  file: FileMeta;
};

export function ThumbnailAlert({ file }: Props) {
  const errors = useAppSelector(selectFilesErrors)[file.id];

  if (!errors.length) {
    return null;
  }

  const errorNodes: Record<UploadError, ReactNode> = {
    transferFailed: <TransferFailed file={file} />,
    alreadyUploaded: <AlreadyUploaded file={file} />,
    fileTooBig: <FileTooBig file={file} />,
    missingDate: <MissingExifData file={file} />,
    missingLocation: <MissingExifData file={file} />,
  };

  const errorTypes = Object.keys(errorNodes) as UploadError[];
  const currentError = errorTypes.find((type) => errors.includes(type));

  return (
    <View
      backgroundColor="negative"
      marginY="static-size-25"
      paddingX="size-75"
      paddingY="size-25"
      UNSAFE_style={{ color: 'var(--spectrum-global-color-static-gray-200)' }}
    >
      <Flex gap="size-75">
        <IconAlert size="S" />
        {currentError && errorNodes[currentError]}
      </Flex>
    </View>
  );
}
