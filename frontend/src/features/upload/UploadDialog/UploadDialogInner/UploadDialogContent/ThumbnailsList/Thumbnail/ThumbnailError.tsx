import { Flex, View } from '@adobe/react-spectrum';
import Alert from '@spectrum-icons/workflow/Alert';
import { FormattedMessage, useIntl } from 'react-intl';

import { useAppSelector } from '~/common/hooks';
import { FileMeta, FileMetaDataError } from '~/features/upload/types';
import { selectFilesValidity } from '~/features/upload/uploadSlice';

type Props = {
  file: FileMeta;
};

export function ThumbnailError({ file }: Props) {
  const filesValidityMap = useAppSelector(selectFilesValidity);
  const errors = filesValidityMap[file.key];
  const { formatMessage, formatList } = useIntl();

  if (!errors.length) {
    return null;
  }

  const missingMetaDataMessageMap: Record<FileMetaDataError, string> = {
    missingDate: formatMessage({
      defaultMessage: 'date',
      description: 'file meta: date',
    }),
    missingLocation: formatMessage({
      defaultMessage: 'GPS location',
      description: 'file meta: location',
    }),
  };

  const missingMetaDataMessages = Object.keys(missingMetaDataMessageMap)
    .filter((key) => errors.includes(key as FileMetaDataError))
    .map((error) => missingMetaDataMessageMap[error as FileMetaDataError]);

  return (
    <View
      backgroundColor="negative"
      marginY="size-50"
      paddingX="size-75"
      paddingY="size-25"
      UNSAFE_style={{ color: 'var(--spectrum-global-color-static-gray-200)' }}
    >
      <Flex gap="size-75">
        <Alert size="S" />
        <FormattedMessage
          defaultMessage="Cannot upload:"
          description="upload thumbnail error intro"
        />
        &nbsp;
        {missingMetaDataMessages.length && (
          <FormattedMessage
            defaultMessage="Missing {items}"
            description="file missing meta data error"
            values={{
              items: formatList(missingMetaDataMessages),
              items_count: missingMetaDataMessages.length,
            }}
          />
        )}
      </Flex>
    </View>
  );
}
