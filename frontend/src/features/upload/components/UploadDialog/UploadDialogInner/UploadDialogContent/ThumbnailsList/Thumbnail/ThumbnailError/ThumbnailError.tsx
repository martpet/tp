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

import { maxPhotoUploadBytes } from '~/common/consts';
import { useAppSelector } from '~/common/hooks';
import { FileMeta, FileMissingMetaDataError } from '~/features/upload/types';
import { selectValidationErrorsMap } from '~/features/upload/uploadSlice';

import classNames from './ThumbnailError.module.css';

type Props = {
  file: FileMeta;
};

export function ThumbnailError({ file }: Props) {
  const validationErrorsMap = useAppSelector(selectValidationErrorsMap);
  const validationErrors = validationErrorsMap[file.id];
  const errors = validationErrors;
  const { formatMessage, formatList, formatNumber } = useIntl();

  let iPhoneHighEfficiencyHelp;
  let duplicateFileText;
  let missingMetaDataText;
  let fileTooBigText;

  if (!errors.length) {
    return null;
  }

  const isMaybeIPhoneHighEfficiencyProblem =
    isIPhone() && errors.includes('missingDate') && errors.includes('missingLocation');

  if (isMaybeIPhoneHighEfficiencyProblem) {
    iPhoneHighEfficiencyHelp = (
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

  const cannotUploadIntro = (
    <>
      <FormattedMessage
        defaultMessage="Cannot upload:"
        description="upload thumbnail error intro"
      />
      &nbsp;
    </>
  );

  if (missingMetaDataMessages.length) {
    missingMetaDataText = (
      <>
        {cannotUploadIntro}
        <FormattedMessage
          defaultMessage="Missing {items}"
          description="file missing meta data error"
          values={{
            items_count: missingMetaDataMessages.length,
            items: formatList(missingMetaDataMessages),
          }}
        />
        {iPhoneHighEfficiencyHelp}
      </>
    );
  }

  if (errors.includes('maxSizeExceeded')) {
    fileTooBigText = (
      <>
        {cannotUploadIntro}
        <FormattedMessage
          defaultMessage="File size is {this_size} but maximum allowed is {max_size}"
          description="upload thumbnail file size error"
          values={{
            this_size: formatNumber(Number((file.size / 1024 / 1024).toFixed(1)), {
              style: 'unit',
              unit: 'megabyte',
              unitDisplay: 'narrow',
            }),
            max_size: formatNumber(maxPhotoUploadBytes / 1024 / 1024, {
              style: 'unit',
              unit: 'megabyte',
              unitDisplay: 'narrow',
            }),
          }}
        />
      </>
    );
  }

  if (errors.includes('isDuplicate')) {
    duplicateFileText = formatMessage({
      defaultMessage: 'This file was already selected',
      description: 'upload thumbnail duplicate file message ',
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
        {duplicateFileText || fileTooBigText || missingMetaDataText}
      </Flex>
    </View>
  );
}
