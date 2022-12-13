import { Badge, SpectrumBadgeProps, Text } from '@adobe/react-spectrum';
import Alert from '@spectrum-icons/workflow/Alert';
import CheckmarkCircle from '@spectrum-icons/workflow/CheckmarkCircle';
import CloudError from '@spectrum-icons/workflow/CloudError';
import { ReactNode } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { useAppSelector } from '~/common/hooks';
import {
  FileMeta,
  selectCompletedUploads,
  selectFilesErrors,
  UploadError,
} from '~/features/upload';

import { FileTooBig } from './FileTooBig';
import { MissingExifData } from './MissingExifData';

type Props = Omit<SpectrumBadgeProps, 'children' | 'variant'> & {
  file: FileMeta;
};

export function ThumbnailAlert({ file, ...badgeProps }: Props) {
  const errors = useAppSelector(selectFilesErrors)[file.id];
  const successfullUploads = useSelector(selectCompletedUploads);
  const isSuccess = successfullUploads.includes(file);
  const { formatMessage } = useIntl();

  if (!errors.length && !isSuccess) {
    return null;
  }

  const errorNodes: Record<UploadError, ReactNode> = {
    alreadyUploaded: (
      <FormattedMessage
        defaultMessage="This photo has been previously uploaded"
        description="upload thumbnail error already uploaded"
      />
    ),
    alreadySelected: (
      <FormattedMessage
        defaultMessage="This photo has already been selected"
        description="upload thumbnail error already selected"
      />
    ),
    uploadFailed: (
      <FormattedMessage
        defaultMessage="Transfer failed"
        description="upload thumbnail error transfer failed"
      />
    ),
    fileTooBig: <FileTooBig file={file} />,
    missingDate: <MissingExifData file={file} />,
    missingLocation: <MissingExifData file={file} />,
  };

  const errorTypes = Object.keys(errorNodes) as UploadError[];
  const error = errorTypes.find((type) => errors.includes(type));

  let Icon = error === 'uploadFailed' ? CloudError : Alert;
  let badgeVariant: SpectrumBadgeProps['variant'] = 'negative';
  let message = error && errorNodes[error];

  if (isSuccess) {
    Icon = CheckmarkCircle;
    badgeVariant = 'positive';
    message = formatMessage({
      defaultMessage: 'Succesfully uploaded',
      description: 'upload thumbnail alert success',
    });
  }

  return (
    <Badge {...badgeProps} variant={badgeVariant} width="100%">
      <Icon />
      <Text>{message}</Text>
    </Badge>
  );
}
