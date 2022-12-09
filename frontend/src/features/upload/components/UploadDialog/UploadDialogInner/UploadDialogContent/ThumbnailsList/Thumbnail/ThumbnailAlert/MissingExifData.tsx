import { isIPhone } from '@react-aria/utils';
import { FormattedMessage, useIntl } from 'react-intl';

import { useAppSelector } from '~/common/hooks';
import { FileMeta } from '~/common/types';
import { MissingExifDataError, selectFilesErrors } from '~/features/upload';

import { CannotUploadText } from './CannotUploadText';
import { IPhoneHighEfficiencyContextualHelp } from './IPhoneHighEfficiencyContextualHelp';

type Props = {
  file: FileMeta;
};

export function MissingExifData({ file }: Props) {
  const errors = useAppSelector(selectFilesErrors)[file.id];
  const { formatMessage, formatList } = useIntl();

  const maybeIPhoneHighEfficiencyFormat =
    isIPhone() && errors.includes('missingDate') && errors.includes('missingLocation');

  const errorTextsMap: Record<MissingExifDataError, string> = {
    missingDate: formatMessage({
      defaultMessage: 'date',
      description: 'file meta: date',
    }),
    missingLocation: formatMessage({
      defaultMessage: 'GPS location',
      description: 'file meta: location',
    }),
  };

  const messages: string[] = [];

  errors.forEach((error) => {
    const text = errorTextsMap[error as MissingExifDataError];
    if (text) messages.push(text);
  });

  if (!messages.length) {
    // return null;
  }

  return (
    <>
      <CannotUploadText />
      &nbsp;
      <FormattedMessage
        defaultMessage="Missing {items}"
        description="file missing meta data error"
        values={{
          items_count: messages.length,
          items: formatList(messages),
        }}
      />
      {maybeIPhoneHighEfficiencyFormat && <IPhoneHighEfficiencyContextualHelp />}
    </>
  );
}
