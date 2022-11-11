import { Content, Heading, IllustratedMessage, View } from '@adobe/react-spectrum';
import UploadIllustration from '@spectrum-icons/illustrations/Upload';
import { FormattedMessage } from 'react-intl';

import { AddFilesButton } from '../../AddFilesButton';

export function EmptyState() {
  return (
    <IllustratedMessage>
      <UploadIllustration aria-hidden="true" />
      <Heading>
        <FormattedMessage
          defaultMessage="Drop your files"
          description="upload empty state illustration heading"
        />
      </Heading>
      <Content>
        <FormattedMessage
          defaultMessage="Select files from your computer or drop them here"
          description="upload empty state illustration body"
        />
        <View marginTop="size-450">
          <AddFilesButton />
        </View>
      </Content>
    </IllustratedMessage>
  );
}
