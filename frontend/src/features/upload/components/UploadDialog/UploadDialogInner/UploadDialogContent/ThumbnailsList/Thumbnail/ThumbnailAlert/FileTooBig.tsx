import { FormattedMessage, useIntl } from 'react-intl';

import { maxPhotoUploadSize } from '~/common/consts';
import { FileMeta } from '~/common/types';

import { CannotUploadText } from './CannotUploadText';

type Props = {
  file: FileMeta;
};

export function FileTooBig({ file }: Props) {
  const { formatNumber } = useIntl();

  return (
    <>
      <CannotUploadText />
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
