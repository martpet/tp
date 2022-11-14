import {
  Content,
  ContextualHelp,
  Flex,
  Heading,
  Text,
  View,
} from '@adobe/react-spectrum';
import { isIPhone } from '@react-aria/utils';
import Alert from '@spectrum-icons/workflow/Alert';
import { FormattedMessage, useIntl } from 'react-intl';

import { useAppSelector } from '~/common/hooks';
import { FileMeta, FileMetaDataError } from '~/features/upload/types';
import { selectFilesValidity } from '~/features/upload/uploadSlice';

import classNames from './ThumbnailError.module.css';

type Props = {
  file: FileMeta;
};

export function ThumbnailError({ file }: Props) {
  const filesValidityMap = useAppSelector(selectFilesValidity);
  const errors = filesValidityMap[file.key];
  const { formatMessage, formatList } = useIntl();
  const maybeIPhoneHighEfficiencySettings =
    isIPhone() && errors.includes('missingDate') && errors.includes('missingLocation');

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

  return (
    <View
      backgroundColor="negative"
      marginY="static-size-25"
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
        {maybeIPhoneHighEfficiencySettings && iPhoneHighEfficiencyHelp}
      </Flex>
    </View>
  );
}
