import { FormattedMessage } from 'react-intl';

import { useAppSelector } from '~/common/hooks';
import { FileMeta } from '~/common/types';
import { selectFilesErrors } from '~/features/upload';

type Props = {
  file: FileMeta;
};

export function TransferFailed({ file }: Props) {
  const errors = useAppSelector(selectFilesErrors)[file.id];

  if (!errors.includes('transferFailed')) {
    return null;
  }

  return (
    <FormattedMessage
      defaultMessage="Transfer failed"
      description="upload thumbnail error transfer failed"
    />
  );
}
