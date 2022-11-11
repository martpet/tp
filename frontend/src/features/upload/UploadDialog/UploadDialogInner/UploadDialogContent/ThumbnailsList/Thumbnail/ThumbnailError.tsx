import { Flex, View } from '@adobe/react-spectrum';
import Alert from '@spectrum-icons/workflow/Alert';
import { FormattedMessage } from 'react-intl';

import { FileMeta } from '~/features/upload/types';

type Props = {
  file: FileMeta;
};

export function ThumbnailError({ file }: Props) {
  if (!file.validityErrors.includes('location')) {
    return null;
  }

  return (
    <View
      backgroundColor="negative"
      marginY="size-25"
      paddingX="size-75"
      paddingY="size-25"
    >
      <Flex gap="size-75">
        <Alert size="S" />
        <FormattedMessage
          defaultMessage="Cannot upload: Missing location data"
          description="upload thumbnail missing location message"
        />
      </Flex>
    </View>
  );
}
