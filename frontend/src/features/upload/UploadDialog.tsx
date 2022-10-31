import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  Divider,
  Heading,
  useDialogContainer,
} from '@adobe/react-spectrum';
import { FormattedMessage } from 'react-intl';

import { Upload } from '~/features/upload';

export function UploadDialog() {
  const { dismiss } = useDialogContainer();

  return (
    <Dialog>
      <Heading>
        <FormattedMessage
          defaultMessage="Upload photos"
          description="upload dialog heading"
        />
      </Heading>
      <Divider />
      <Content>
        <Upload />
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={dismiss}>
          <FormattedMessage
            defaultMessage="Close"
            description="upload dialog close button"
          />
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}
