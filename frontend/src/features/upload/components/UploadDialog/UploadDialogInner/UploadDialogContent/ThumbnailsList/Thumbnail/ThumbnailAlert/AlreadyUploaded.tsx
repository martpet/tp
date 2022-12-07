import { FormattedMessage } from 'react-intl';

import { useAppSelector } from '~/common/hooks';
import { FileMeta } from '~/common/types';
import { selectFilesErrors } from '~/features/upload';

type Props = {
  file: FileMeta;
};

export function AlreadyUploaded({ file }: Props) {
  const errors = useAppSelector(selectFilesErrors)[file.id];

  if (!errors.includes('alreadyUploaded')) {
    return null;
  }

  return (
    <FormattedMessage
      defaultMessage="This photo has been previously uploaded"
      description="upload thumbnail error already uploaded"
    />
  );
}
