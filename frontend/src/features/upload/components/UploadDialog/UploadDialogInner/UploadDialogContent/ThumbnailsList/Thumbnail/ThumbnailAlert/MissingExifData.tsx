import { isIPhone } from '@react-aria/utils';
import { FormattedMessage, useIntl } from 'react-intl';

import { useAppSelector } from '~/common/hooks';
import { FileMeta } from '~/common/types';
import { selectFilesErrors } from '~/features/upload';
import { MissingExifDataError } from '~/features/upload/types';

import { CannotUploadText } from './CannotUploadText';
import { IPhoneHighEfficiencyContextualHelp } from './IPhoneHighEfficiencyContextualHelp';

type Props = {
  file: FileMeta;
};

export function MissingExifData({ file }: Props) {
  const errors = useAppSelector(selectFilesErrors)[file.id];
  const { formatMessage, formatList } = useIntl();

  const missingMetaDataErrorMap: Record<MissingExifDataError, string> = {
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
    .filter((key) => errors.includes(key as MissingExifDataError))
    .map((error) => missingMetaDataErrorMap[error as MissingExifDataError]);

  const isMaybeIPhoneHighEfficiencyProblem =
    isIPhone() && errors.includes('missingDate') && errors.includes('missingLocation');

  if (!missingMetaDataMessages.length) {
    return null;
  }

  return (
    <>
      <CannotUploadText />
      &nbsp;
      <FormattedMessage
        defaultMessage="Missing {items}"
        description="file missing meta data error"
        values={{
          items_count: missingMetaDataMessages.length,
          items: formatList(missingMetaDataMessages),
        }}
      />
      {isMaybeIPhoneHighEfficiencyProblem && IPhoneHighEfficiencyContextualHelp}
    </>
  );
}
