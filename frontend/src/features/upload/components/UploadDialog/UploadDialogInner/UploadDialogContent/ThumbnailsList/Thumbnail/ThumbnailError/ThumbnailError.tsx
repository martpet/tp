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

import { maxPhotoUploadSize } from '~/common/consts';
import { useAppSelector } from '~/common/hooks';
import { selectFilesErrorsMap } from '~/features/upload';
import { FileMeta, FileMissingMetaDataError } from '~/features/upload/types';

import classNames from './ThumbnailError.module.css';

type Props = {
  file: FileMeta;
};

export function ThumbnailError({ file }: Props) {
  const errorsMap = useAppSelector(selectFilesErrorsMap);
  const errors = errorsMap[file.id];
  const { formatMessage, formatList, formatNumber } = useIntl();

  let missingMetaDataText;
  let fileTooBigText;
  let alreadyUploadedText;

  if (!errors.length) {
    return null;
  }

  const missingMetaDataErrorMap: Record<FileMissingMetaDataError, string> = {
    missingDate: formatMessage({
      defaultMessage: 'date',
      description: 'file meta: date',
    }),
    missingLocation: formatMessage({
      defaultMessage: 'GPS location',
      description: 'file meta: location',
    }),
  };

  const missingMetaDataMessages = Object.keys(missingMetaDataErrorMap)
    .filter((key) => errors.includes(key as FileMissingMetaDataError))
    .map((error) => missingMetaDataErrorMap[error as FileMissingMetaDataError]);

  const cannotUploadIntroText = (
    <>
      <FormattedMessage
        defaultMessage="Cannot upload:"
        description="upload thumbnail error intro"
      />
      &nbsp;
    </>
  );

  const isMaybeIPhoneHighEfficiencyProblem =
    isIPhone() && errors.includes('missingDate') && errors.includes('missingLocation');

  const iPhoneHighEfficiencyHelp = (
    <ContextualHelp variant="help" UNSAFE_className={classNames.contextualHelp}>
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

  if (missingMetaDataMessages.length) {
    missingMetaDataText = (
      <>
        {cannotUploadIntroText}
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
  }

  if (errors.includes('maxSizeExceeded')) {
    fileTooBigText = (
      <>
        {cannotUploadIntroText}
        <FormattedMessage
          defaultMessage="File size is {this_size} but maximum allowed is {max_size}"
          description="upload thumbnail file size error"
          values={{
            this_size: formatNumber(Number((file.size / 1024 / 1024).toFixed(1)), {
              style: 'unit',
              unit: 'megabyte',
              unitDisplay: 'narrow',
            }),
            max_size: formatNumber(maxPhotoUploadSize / 1024 / 1024, {
              style: 'unit',
              unit: 'megabyte',
              unitDisplay: 'narrow',
            }),
          }}
        />
      </>
    );
  }

  if (errors.includes('alreadyUploaded')) {
    alreadyUploadedText = formatMessage({
      defaultMessage: 'This photo has been previously uploaded',
      description: 'upload thumbnail error already uploaded',
    });
  }

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
        {alreadyUploadedText || fileTooBigText || missingMetaDataText}
      </Flex>
    </View>
  );
}
