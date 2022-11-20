import {
  Content,
  ContextualHelp,
  Flex,
  Heading,
  Text,
  View,
} from '@adobe/react-spectrum';
import { isIPhone } from '@react-aria/utils';
import IconAlert from '@spectrum-icons/workflow/Alert';
import { FormattedMessage, useIntl } from 'react-intl';

import { useAppSelector } from '~/common/hooks';
import { FileMeta, FileMetaDataError } from '~/features/upload/types';
import {
  selectDuplicateFiles,
  selectFilesValidationErrors,
} from '~/features/upload/uploadSlice';

import classNames from './ThumbnailError.module.css';

type Props = {
  file: FileMeta;
};

export function ThumbnailError({ file }: Props) {
  const filesValidationErrors = useAppSelector(selectFilesValidationErrors);
  const validationErrors = filesValidationErrors[file.id];
  const duplicateFiles = useAppSelector(selectDuplicateFiles);
  const isDuplicateFile = duplicateFiles.includes(file);
  const isAlert = !isDuplicateFile;
  const { formatMessage, formatList } = useIntl();

  if (!validationErrors.length && !isDuplicateFile) {
    return null;
  }

  const isMaybeIPhoneHighEfficiencyProblem =
    isIPhone() &&
    validationErrors.includes('missingDate') &&
    validationErrors.includes('missingLocation');

  const iPhoneHighEfficiencyHelp = (
    <ContextualHelp variant="info" UNSAFE_className={classNames.contextualHelp}>
      <Heading>
        <FormattedMessage
          defaultMessage="iPhone users"
          description="thumbnail error iphone high efficiency help heading"
        />
      </Heading>
      <Content>
        <Text>
          <FormattedMessage
            defaultMessage='Photos taken with <em>"High Efficiency"</em> (<em>Settings → Camera → Formats</em>) cannot be uploaded from an iPhone. You can upload this photo from a Mac.'
            description="thumbnail error iphone high efficiency help content"
            values={{ em: (str) => <em>{str}</em> }}
          />
        </Text>
      </Content>
    </ContextualHelp>
  );

  const missingMetaDataMessagesMap: Record<FileMetaDataError, string> = {
    missingDate: formatMessage({
      defaultMessage: 'date',
      description: 'file meta: date',
    }),
    missingLocation: formatMessage({
      defaultMessage: 'GPS location',
      description: 'file meta: location',
    }),
  };

  const missingMetaDataMessages = Object.keys(missingMetaDataMessagesMap)
    .filter((key) => validationErrors.includes(key as FileMetaDataError))
    .map((error) => missingMetaDataMessagesMap[error as FileMetaDataError]);

  const missingDataMessage = (
    <>
      <FormattedMessage
        defaultMessage="Cannot upload:"
        description="upload thumbnail error intro"
      />
      &nbsp;
      <FormattedMessage
        defaultMessage="Missing {items}"
        description="file missing meta data error"
        values={{
          items_count: missingMetaDataMessages.length,
          items: formatList(missingMetaDataMessages),
        }}
      />
      {isMaybeIPhoneHighEfficiencyProblem && iPhoneHighEfficiencyHelp}
    </>
  );

  const duplicateFileMessage = formatMessage({
    defaultMessage: 'This file was already selected',
    description: 'upload thumbnail duplicate file message ',
  });

  return (
    <View
      backgroundColor={isAlert ? 'negative' : 'notice'}
      marginY="static-size-25"
      paddingX="size-75"
      paddingY="size-25"
      UNSAFE_style={{ color: 'var(--spectrum-global-color-static-gray-200)' }}
    >
      <Flex gap="size-75">
        {isAlert && <IconAlert size="S" />}
        {isDuplicateFile ? duplicateFileMessage : missingDataMessage}
      </Flex>
    </View>
  );
}
