import { ButtonGroup, Content, Divider, Heading } from '@adobe/react-spectrum';
import { FormattedMessage } from 'react-intl';

import { UploadDialogButtons } from './UploadDialogButtons/UploadDialogButtons';
import UploadDialogContent from './UploadDialogContent/UploadDialogContent';

export default function UploadDialog() {
  return (
    <>
      <Heading>
        <FormattedMessage
          defaultMessage="Upload photos"
          description="upload dialog heading"
        />
      </Heading>
      <Divider />
      <Content>
        <UploadDialogContent />
      </Content>
      <ButtonGroup>
        <UploadDialogButtons />
      </ButtonGroup>
    </>
  );
}
